package com.wot.fit.service;

import com.wot.fit.domain.FitFeedback;
import com.wot.fit.domain.ProfileState;
import com.wot.fit.domain.ShoeEntity;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class FitConfidenceCalculator {
  private FitConfidenceCalculator() {}

  public static ConfidenceResult calculate(List<ShoeEntity> shoes) {
    if (shoes == null || shoes.isEmpty()) {
      return new ConfidenceResult(BigDecimal.ZERO, ProfileState.LOW_CONFIDENCE);
    }

    int n = shoes.size();
    Map<FitFeedback, Integer> counts = new EnumMap<>(FitFeedback.class);
    for (ShoeEntity s : shoes) {
      counts.merge(s.getFitFeedback(), 1, Integer::sum);
    }

    int maxCount = 0;
    for (Integer c : counts.values()) {
      if (c != null && c > maxCount) {
        maxCount = c;
      }
    }

    BigDecimal base = BigDecimal.valueOf(Math.min(n, 5)).multiply(BigDecimal.valueOf(0.15)); // up to 0.75
    BigDecimal consistency = BigDecimal.valueOf((double) maxCount / (double) n).multiply(BigDecimal.valueOf(0.25)); // up to 0.25

    BigDecimal confidence = base.add(consistency).setScale(4, RoundingMode.HALF_UP);
    if (confidence.compareTo(BigDecimal.ONE) > 0) {
      confidence = BigDecimal.ONE.setScale(4, RoundingMode.HALF_UP);
    }

    ProfileState state = confidence.compareTo(BigDecimal.valueOf(0.65)) >= 0
        ? ProfileState.VALIDATED
        : ProfileState.LOW_CONFIDENCE;

    return new ConfidenceResult(confidence, state);
  }

  public record ConfidenceResult(BigDecimal confidence, ProfileState profileState) {}
}

