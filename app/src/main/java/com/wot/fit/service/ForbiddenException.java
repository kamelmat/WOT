package com.wot.fit.service;

public class ForbiddenException extends RuntimeException {
  private final String errorCode;

  public ForbiddenException(String errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }

  public String getErrorCode() {
    return errorCode;
  }
}
