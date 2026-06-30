package com.wot.fit.service;

public class UnauthorizedException extends RuntimeException {
  private final String errorCode;

  public UnauthorizedException(String errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }

  public String getErrorCode() {
    return errorCode;
  }
}
