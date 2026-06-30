package com.wot.fit.audit;

import java.time.OffsetDateTime;

public class AuditEvent {
  private String eventType;
  private String status;
  private String subjectId;
  private OffsetDateTime timestamp;

  public AuditEvent() {}

  public AuditEvent(String eventType, String status, String subjectId, OffsetDateTime timestamp) {
    this.eventType = eventType;
    this.status = status;
    this.subjectId = subjectId;
    this.timestamp = timestamp;
  }

  public String getEventType() {
    return eventType;
  }

  public void setEventType(String eventType) {
    this.eventType = eventType;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getSubjectId() {
    return subjectId;
  }

  public void setSubjectId(String subjectId) {
    this.subjectId = subjectId;
  }

  public OffsetDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
  }
}

