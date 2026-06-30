package com.wot.fit.api.dto;

import java.math.BigDecimal;

public class AddShoeResponse {
  private String status;
  private String fitProfileId;
  private BigDecimal confidence;
  private String timestamp;

  public AddShoeResponse() {}

  public AddShoeResponse(String status, String fitProfileId, BigDecimal confidence, String timestamp) {
    this.status = status;
    this.fitProfileId = fitProfileId;
    this.confidence = confidence;
    this.timestamp = timestamp;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
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

  public String getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(String timestamp) {
    this.timestamp = timestamp;
  }
}

