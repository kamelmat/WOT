package com.wot.fit.service;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public final class PainTagExtractor {
  private PainTagExtractor() {}

  public static Set<String> normalizeTokens(String input) {
    Set<String> tokens = new HashSet<>();
    if (input == null || input.isBlank()) {
      return tokens;
    }
    String normalized = input
        .toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9\\s]", " ");
    for (String part : normalized.split("\\s+")) {
      if (part.length() >= 3) {
        tokens.add(part);
      }
    }
    return tokens;
  }

  public static Set<String> extractTags(String painText, String likedText) {
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

    tags.addAll(normalizeTokens(combined));
    return tags;
  }

  public static int overlapScore(Set<String> queryTags, String painText, String likedText) {
    if (queryTags.isEmpty()) {
      return 0;
    }
    Set<String> candidateTags = extractTags(painText, likedText);
    int score = 0;
    for (String tag : queryTags) {
      if (candidateTags.contains(tag)) {
        score++;
      }
    }
    return score;
  }
}
