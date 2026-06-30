package com.wot.fit.error;

public class ApiError {
  private String errorCode;
  private String message;
  private String timestamp;
  private String traceId;

  public ApiError() {}

  public ApiError(String errorCode, String message, String timestamp, String traceId) {
    this.errorCode = errorCode;
    this.message = message;
    this.timestamp = timestamp;
    this.traceId = traceId;
  }

  public String getErrorCode() {
    return errorCode;
  }

  public void setErrorCode(String errorCode) {
    this.errorCode = errorCode;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(String timestamp) {
    this.timestamp = timestamp;
  }

  public String getTraceId() {
    return traceId;
  }

  public void setTraceId(String traceId) {
    this.traceId = traceId;
  }
}

