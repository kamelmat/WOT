package com.wot.fit.api.dto;

public class UpdateProfileResponse {
  private String status;
  private String fitProfileId;

  public UpdateProfileResponse() {}

  public UpdateProfileResponse(String status, String fitProfileId) {
    this.status = status;
    this.fitProfileId = fitProfileId;
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
}

