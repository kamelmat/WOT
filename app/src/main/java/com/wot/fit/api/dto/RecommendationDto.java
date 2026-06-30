package com.wot.fit.api.dto;

public class RecommendationDto {
  private String brand;
  private String model;
  private String size;
  private int fitScore;
  private String fitLabel;
  private String imageUrl;

  public RecommendationDto() {}

  public RecommendationDto(String brand, String model, String size, int fitScore, String fitLabel) {
    this.brand = brand;
    this.model = model;
    this.size = size;
    this.fitScore = fitScore;
    this.fitLabel = fitLabel;
  }

  public RecommendationDto(
      String brand,
      String model,
      String size,
      int fitScore,
      String fitLabel,
      String imageUrl
  ) {
    this.brand = brand;
    this.model = model;
    this.size = size;
    this.fitScore = fitScore;
    this.fitLabel = fitLabel;
    this.imageUrl = imageUrl;
  }

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

  public int getFitScore() {
    return fitScore;
  }

  public void setFitScore(int fitScore) {
    this.fitScore = fitScore;
  }

  public String getFitLabel() {
    return fitLabel;
  }

  public void setFitLabel(String fitLabel) {
    this.fitLabel = fitLabel;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }
}

