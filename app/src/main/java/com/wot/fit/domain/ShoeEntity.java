package com.wot.fit.domain;

import java.time.OffsetDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "shoes")
public class ShoeEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "fit_profile_id", nullable = false)
  private FitProfileEntity fitProfile;

  @Column(name = "brand", nullable = false, length = 128)
  private String brand;

  @Column(name = "model", nullable = false, length = 128)
  private String model;

  @Column(name = "size", nullable = false, length = 32)
  private String size;

  @Enumerated(EnumType.STRING)
  @Column(name = "fit_feedback", nullable = false, length = 16)
  private FitFeedback fitFeedback;

  @Column(name = "liked_description", length = 2000)
  private String likedDescription;

  @Column(name = "image_path", length = 1024)
  private String imagePath;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  void onCreate() {
    this.createdAt = OffsetDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public FitProfileEntity getFitProfile() {
    return fitProfile;
  }

  public void setFitProfile(FitProfileEntity fitProfile) {
    this.fitProfile = fitProfile;
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

  public FitFeedback getFitFeedback() {
    return fitFeedback;
  }

  public void setFitFeedback(FitFeedback fitFeedback) {
    this.fitFeedback = fitFeedback;
  }

  public String getLikedDescription() {
    return likedDescription;
  }

  public void setLikedDescription(String likedDescription) {
    this.likedDescription = likedDescription;
  }

  public String getImagePath() {
    return imagePath;
  }

  public void setImagePath(String imagePath) {
    this.imagePath = imagePath;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}

