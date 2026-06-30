package com.wot.fit.service;

import com.wot.fit.api.dto.SocialSuggestionDto;
import com.wot.fit.domain.ShoeEntity;
import com.wot.fit.repository.ShoeRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SocialService {
  private final ShoeRepository shoeRepository;

  public SocialService(ShoeRepository shoeRepository) {
    this.shoeRepository = shoeRepository;
  }

  @Transactional(readOnly = true)
  public List<SocialSuggestionDto> suggestions(String currentUserId, String painQuery) {
    String pain = painQuery == null ? "" : painQuery.trim();
    Set<String> queryTags = PainTagExtractor.extractTags(pain, "");
    boolean filterByPain = !queryTags.isEmpty();
    List<ShoeEntity> candidates = shoeRepository.findPerfectShoesFromOtherUsers(currentUserId);

    Map<String, Aggregated> aggregated = new HashMap<>();

    for (ShoeEntity shoe : candidates) {
      var profile = shoe.getFitProfile();
      int overlap = PainTagExtractor.overlapScore(
          queryTags,
          profile.getPain(),
          shoe.getLikedDescription()
      );
      if (filterByPain && overlap == 0) {
        continue;
      }

      String key = shoe.getBrand() + "|" + shoe.getModel();
      Aggregated entry = aggregated.computeIfAbsent(key, k -> new Aggregated(shoe));
      entry.profileIds.add(profile.getPublicId());
      entry.overlapScore += filterByPain ? overlap : 1;
      if (shoe.getImagePath() != null && entry.imageUrl == null) {
        entry.imageUrl = shoe.getImagePath();
      }
    }

    List<SocialSuggestionDto> results = new ArrayList<>();
    for (Aggregated entry : aggregated.values()) {
      int socialCount = entry.profileIds.size();
      int fitScore = Math.min(98, 78 + socialCount * 6 + entry.overlapScore * 2);
      String fitLabel = socialCount >= 2 ? "PERFECT" : "SLIGHTLY_LOOSE";
      results.add(new SocialSuggestionDto(
          entry.brand,
          entry.model,
          entry.size,
          fitScore,
          fitLabel,
          entry.imageUrl,
          socialCount
      ));
    }

    results.sort(
        Comparator
            .comparingInt(SocialSuggestionDto::getSocialCount).reversed()
            .thenComparingInt(SocialSuggestionDto::getFitScore).reversed()
            .thenComparing(SocialSuggestionDto::getBrand)
            .thenComparing(SocialSuggestionDto::getModel)
    );

    return results.stream().limit(6).toList();
  }

  private static final class Aggregated {
    private final String brand;
    private final String model;
    private final String size;
    private String imageUrl;
    private final Set<String> profileIds = new HashSet<>();
    private int overlapScore;

    private Aggregated(ShoeEntity shoe) {
      this.brand = shoe.getBrand();
      this.model = shoe.getModel();
      this.size = shoe.getSize();
      this.imageUrl = shoe.getImagePath();
    }
  }
}
