package com.wot.fit.service;

import com.wot.fit.api.dto.AddShoeRequest;
import com.wot.fit.api.dto.RecommendationDto;
import com.wot.fit.audit.AuditService;
import com.wot.fit.domain.FitProfileEntity;
import com.wot.fit.domain.ShoeEntity;
import com.wot.fit.repository.FitProfileRepository;
import com.wot.fit.repository.ShoeRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.Optional;
import java.util.HashSet;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FitService {
  private final FitProfileRepository fitProfileRepository;
  private final ShoeRepository shoeRepository;
  private final AuditService auditService;

  public FitService(
      FitProfileRepository fitProfileRepository,
      ShoeRepository shoeRepository,
      AuditService auditService
  ) {
    this.fitProfileRepository = fitProfileRepository;
    this.shoeRepository = shoeRepository;
    this.auditService = auditService;
  }

  @Transactional
  public FitProfileEntity addShoe(String userId, AddShoeRequest request) {
    return addShoe(userId, request, null);
  }

  @Transactional
  public FitProfileEntity addShoe(String userId, AddShoeRequest request, String imageUrl) {
    FitProfileEntity profile = fitProfileRepository
        .findFirstByUserIdOrderByUpdatedAtDesc(userId)
        .orElseGet(() -> {
          FitProfileEntity created = new FitProfileEntity();
          created.setUserId(userId);
          created.setPublicId(generatePublicId());
          return created;
        });

    ShoeEntity shoe = new ShoeEntity();
    shoe.setFitProfile(profile);
    shoe.setBrand(request.getBrand().trim());
    shoe.setModel(request.getModel().trim());
    shoe.setSize(normalizeSize(request.getSize()));
    shoe.setFitFeedback(request.getFitFeedback());
    shoe.setLikedDescription(normalizeText(request.getLiked()));
    shoe.setImagePath(imageUrl);

    profile.getShoes().add(shoe);

    FitProfileEntity saved = fitProfileRepository.save(profile);

    List<ShoeEntity> shoes = shoeRepository.findAllByFitProfilePublicIdOrderByCreatedAtAsc(saved.getPublicId());
    FitConfidenceCalculator.ConfidenceResult result = FitConfidenceCalculator.calculate(shoes);
    saved.setConfidence(result.confidence());
    saved.setProfileState(result.profileState());

    FitProfileEntity updated = fitProfileRepository.save(saved);
    auditService.record("FIT_RECORDED", "SUCCESS", updated.getPublicId());
    return updated;
  }

  @Transactional(readOnly = true)
  public Optional<FitProfileEntity> findProfileForUser(String userId) {
    return fitProfileRepository.findFirstByUserIdOrderByUpdatedAtDesc(userId);
  }

  @Transactional
  public FitProfileEntity validateProfile(String fitProfilePublicId, String userId) {
    FitProfileEntity profile = requireOwnedProfile(fitProfilePublicId, userId);

    List<ShoeEntity> shoes = shoeRepository.findAllByFitProfilePublicIdOrderByCreatedAtAsc(profile.getPublicId());
    FitConfidenceCalculator.ConfidenceResult result = FitConfidenceCalculator.calculate(shoes);
    profile.setConfidence(result.confidence());
    profile.setProfileState(result.profileState());
    FitProfileEntity updated = fitProfileRepository.save(profile);
    auditService.record("VALIDATED", "SUCCESS", updated.getPublicId());
    return updated;
  }

  @Transactional(readOnly = true)
  public Recommendations recommendations(String fitProfilePublicId, String userId) {
    FitProfileEntity profile = requireOwnedProfile(fitProfilePublicId, userId);

    List<ShoeEntity> shoes = shoeRepository.findAllByFitProfilePublicIdOrderByCreatedAtAsc(profile.getPublicId());
    Optional<ShoeEntity> last = shoes.isEmpty() ? Optional.empty() : Optional.of(shoes.get(shoes.size() - 1));
    String size = last.map(ShoeEntity::getSize).orElse("EU 42");

    BigDecimal confidence = profile.getConfidence();
    int baseScore = 70 + confidence.multiply(BigDecimal.valueOf(30)).intValue(); // 70..100

    Set<String> userTags = extractUserTags(profile.getPain(), extractPerfectShoeText(shoes));
    boolean hasPerfect = shoes.stream().anyMatch(s -> s.getFitFeedback() != null && s.getFitFeedback().name().equals("PERFECT"));

    List<CatalogEntry> catalog = catalogEntries();

    List<RecommendationDto> candidates = new java.util.ArrayList<>();

    // 1) If the user has a perfect-fit shoe, include it so uploaded images can show up.
    for (ShoeEntity s : shoes) {
      if (s.getFitFeedback() != null && s.getFitFeedback().name().equals("PERFECT")) {
        candidates.add(new RecommendationDto(
            s.getBrand(),
            s.getModel(),
            s.getSize(),
            98,
            "PERFECT",
            s.getImagePath()
        ));
      }
    }

    // 2) Recommend from catalog using pain/liked metadata.
    for (CatalogEntry e : catalog) {
      int score = baseScore;
      if (hasPerfect) {
        score += 20;
      }

      int overlap = 0;
      for (String tag : e.tags) {
        if (userTags.contains(tag)) {
          overlap++;
        }
      }
      score += overlap * 15;

      for (ShoeEntity ps : shoes) {
        if (ps.getFitFeedback() != null && ps.getFitFeedback().name().equals("PERFECT")) {
          if (ps.getBrand() != null && ps.getBrand().equalsIgnoreCase(e.brand)) {
            score += 8;
          }
          if (ps.getModel() != null && ps.getModel().equalsIgnoreCase(e.model)) {
            score += 5;
          }
        }
      }

      score = clamp(score);

      String fitLabel = e.defaultFitLabel;
      candidates.add(new RecommendationDto(e.brand, e.model, size, score, fitLabel, null));
    }

    // 3) Sort deterministically (score desc, brand+model asc) and return top N.
    candidates.sort(
        java.util.Comparator
            .comparingInt((RecommendationDto r) -> r.getFitScore()).reversed()
            .thenComparing(r -> r.getBrand() == null ? "" : r.getBrand())
            .thenComparing(r -> r.getModel() == null ? "" : r.getModel())
    );

    List<RecommendationDto> recs = candidates.stream().limit(4).toList();
    return new Recommendations(recs, confidence, OffsetDateTime.now());
  }

  @Transactional
  public FitProfileEntity updateProfilePain(String fitProfilePublicId, String userId, String pain) {
    FitProfileEntity profile = requireOwnedProfile(fitProfilePublicId, userId);
    profile.setPain(normalizeText(pain));
    FitProfileEntity updated = fitProfileRepository.save(profile);
    auditService.record("PROFILE_UPDATED", "SUCCESS", updated.getPublicId());
    return updated;
  }

  private FitProfileEntity requireOwnedProfile(String fitProfilePublicId, String userId) {
    FitProfileEntity profile = fitProfileRepository.findByPublicId(fitProfilePublicId)
        .orElseThrow(() -> new NotFoundException("FIT_PROFILE_NOT_FOUND", "Fit profile not found"));
    if (!profile.getUserId().equals(userId)) {
      throw new ForbiddenException("FORBIDDEN", "You do not have access to this fit profile");
    }
    return profile;
  }

  private static int clamp(int v) {
    return Math.max(0, Math.min(100, v));
  }

  private static String generatePublicId() {
    return "FP" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase(Locale.ROOT);
  }

  private static String normalizeSize(String input) {
    String trimmed = input == null ? "" : input.trim();
    return trimmed.isEmpty() ? trimmed : trimmed;
  }

  private static String normalizeText(String input) {
    if (input == null) {
      return null;
    }
    String t = input.trim();
    return t.isEmpty() ? null : t;
  }

  private static String bumpHalf(String size) {
    // Simple deterministic tweak for examples: "EU 42" -> "EU 42.5"
    if (size == null) {
      return "EU 42.5";
    }
    String s = size.trim();
    if (s.matches("(?i)^EU\\s+\\d+(?:\\.5)?$")) {
      if (s.endsWith(".5")) {
        return s;
      }
      return s + ".5";
    }
    return s;
  }

  private static String extractPerfectShoeText(List<ShoeEntity> shoes) {
    if (shoes == null) {
      return "";
    }
    StringBuilder sb = new StringBuilder();
    for (ShoeEntity s : shoes) {
      if (s != null && s.getFitFeedback() != null && s.getFitFeedback().name().equals("PERFECT")) {
        if (s.getLikedDescription() != null) {
          sb.append(' ').append(s.getLikedDescription());
        }
      }
    }
    return sb.toString();
  }

  private static Set<String> extractUserTags(String painText, String likedText) {
    String p = painText == null ? "" : painText.toLowerCase(Locale.ROOT);
    String l = likedText == null ? "" : likedText.toLowerCase(Locale.ROOT);
    String combined = p + " " + l;

    Set<String> tags = new HashSet<>();

    if (combined.contains("bunion")) {
      if (combined.contains("left")) {
        tags.add("bunions-left");
      }
      if (combined.contains("right")) {
        tags.add("bunions-right");
      }
    }

    if (combined.contains("too wide") || combined.contains("wide") || combined.contains("2e") || combined.contains("4e")) {
      tags.add("wide-foot");
    }

    if (combined.contains("orthotic") || combined.contains("orthotics") || combined.contains("plantill")) {
      tags.add("orthotics");
    }

    if (combined.contains("comfort") || combined.contains("comfortable") || combined.contains("comodas")) {
      tags.add("comfort");
    }

    if (combined.contains("stable") || combined.contains("stability")) {
      tags.add("stability");
    }

    return tags;
  }

  private record CatalogEntry(String brand, String model, Set<String> tags, String defaultFitLabel) {}

  private static List<CatalogEntry> catalogEntries() {
    return List.of(
        new CatalogEntry("Nike", "AVA Rover", Set.of("wide-foot", "bunions-left", "comfort"), "PERFECT"),
        new CatalogEntry("Nike", "SB Dunk Low Pro", Set.of("comfort", "stability"), "SLIGHTLY_LOOSE"),
        new CatalogEntry("HOKA", "Clifton 9", Set.of("orthotics", "wide-foot", "comfort"), "PERFECT"),
        new CatalogEntry("Vans", "Rowley Classic", Set.of("comfort", "wide-foot"), "SLIGHTLY_LOOSE"),
        new CatalogEntry("Vans", "UltraRange 20", Set.of("comfort", "stability"), "SLIGHTLY_LOOSE"),
        new CatalogEntry("On", "Cloudrunner", Set.of("comfort", "orthotics"), "SLIGHTLY_LOOSE")
    );
  }

  public record Recommendations(List<RecommendationDto> recommendations, BigDecimal confidence, OffsetDateTime timestamp) {}
}

