package com.wot.fit.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class RecommendationsResponse {
  private List<RecommendationDto> recommendations;
  private BigDecimal confidence;

  public RecommendationsResponse() {}

  public RecommendationsResponse(List<RecommendationDto> recommendations, BigDecimal confidence) {
    this.recommendations = recommendations;
    this.confidence = confidence;
  }

  public List<RecommendationDto> getRecommendations() {
    return recommendations;
  }

  public void setRecommendations(List<RecommendationDto> recommendations) {
    this.recommendations = recommendations;
  }

  public BigDecimal getConfidence() {
    return confidence;
  }

  public void setConfidence(BigDecimal confidence) {
    this.confidence = confidence;
  }
}

