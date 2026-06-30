package com.wot.fit.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ValidateFitRequest {
  @NotBlank
  @Size(max = 64)
  private String fitProfileId;

  public String getFitProfileId() {
    return fitProfileId;
  }

  public void setFitProfileId(String fitProfileId) {
    this.fitProfileId = fitProfileId;
  }
}

