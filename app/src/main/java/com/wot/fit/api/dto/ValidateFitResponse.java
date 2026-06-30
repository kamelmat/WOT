package com.wot.fit.api.dto;

import java.math.BigDecimal;

public class ValidateFitResponse {
  private String status;
  private String fitProfileId;
  private BigDecimal confidence;
  private String profileState;

  public ValidateFitResponse() {}

  public ValidateFitResponse(String status, String fitProfileId, BigDecimal confidence, String profileState) {
    this.status = status;
    this.fitProfileId = fitProfileId;
    this.confidence = confidence;
    this.profileState = profileState;
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

  public String getProfileState() {
    return profileState;
  }

  public void setProfileState(String profileState) {
    this.profileState = profileState;
  }
}

