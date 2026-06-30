package com.wot.fit.api.dto;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

public class ValidateFitRequestTest {
  private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

  @Test
  void validRequestHasNoViolations() {
    ValidateFitRequest req = new ValidateFitRequest();
    req.setFitProfileId("FPABCDEF1234");
    assertTrue(validator.validate(req).isEmpty());
  }

  @Test
  void blankIdIsInvalid() {
    ValidateFitRequest req = new ValidateFitRequest();
    req.setFitProfileId(" ");
    assertFalse(validator.validate(req).isEmpty());
  }
}

