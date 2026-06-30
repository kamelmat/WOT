package com.wot.fit.api.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
  @Size(max = 2000)
  private String pain;

  public String getPain() {
    return pain;
  }

  public void setPain(String pain) {
    this.pain = pain;
  }
}

