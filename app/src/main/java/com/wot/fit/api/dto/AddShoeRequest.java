package com.wot.fit.api.dto;

import com.wot.fit.domain.FitFeedback;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AddShoeRequest {
  @NotBlank
  @Size(max = 128)
  private String brand;

  @NotBlank
  @Size(max = 128)
  private String model;

  @NotBlank
  @Size(max = 32)
  private String size;

  @NotNull
  private FitFeedback fitFeedback;

  @Size(max = 512)
  private String liked;

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public FitFeedback getFitFeedback() {
    return fitFeedback;
  }

  public void setFitFeedback(FitFeedback fitFeedback) {
    this.fitFeedback = fitFeedback;
  }

  public String getLiked() {
    return liked;
  }

  public void setLiked(String liked) {
    this.liked = liked;
  }
}

