package com.wot.fit.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "fit_profiles")
public class FitProfileEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "public_id", nullable = false, unique = true, length = 64)
  private String publicId;

  @Column(name = "user_id", nullable = false, length = 64)
  private String userId;

  @Column(name = "confidence", nullable = false, precision = 5, scale = 4)
  private BigDecimal confidence = BigDecimal.ZERO;

  @Enumerated(EnumType.STRING)
  @Column(name = "profile_state", nullable = false, length = 32)
  private ProfileState profileState = ProfileState.LOW_CONFIDENCE;

  @Column(name = "pain", length = 2000)
  private String pain;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  @OneToMany(mappedBy = "fitProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<ShoeEntity> shoes = new ArrayList<>();

  @PrePersist
  void onCreate() {
    OffsetDateTime now = OffsetDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = OffsetDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public String getPublicId() {
    return publicId;
  }

  public void setPublicId(String publicId) {
    this.publicId = publicId;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public BigDecimal getConfidence() {
    return confidence;
  }

  public void setConfidence(BigDecimal confidence) {
    this.confidence = confidence;
  }

  public ProfileState getProfileState() {
    return profileState;
  }

  public void setProfileState(ProfileState profileState) {
    this.profileState = profileState;
  }

  public String getPain() {
    return pain;
  }

  public void setPain(String pain) {
    this.pain = pain;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  public List<ShoeEntity> getShoes() {
    return shoes;
  }
}

