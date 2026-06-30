package com.wot.fit.api.dto;

import java.math.BigDecimal;

public class FitProfileSummaryResponse {
  private String fitProfileId;
  private BigDecimal confidence;

  public FitProfileSummaryResponse() {}

  public FitProfileSummaryResponse(String fitProfileId, BigDecimal confidence) {
    this.fitProfileId = fitProfileId;
    this.confidence = confidence;
  }

  public String getFitProfileId() {
    return fitProfileId;
  }

  public void setFitProfileId(String fitProfileId) {
    this.fitProfileId = fitProfileId;
  }

  public BigDecimal getConfidence() {
    return confidence;
  }

  public void setConfidence(BigDecimal confidence) {
    this.confidence = confidence;
  }
}
