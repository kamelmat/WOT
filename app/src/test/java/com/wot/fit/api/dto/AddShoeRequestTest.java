package com.wot.fit.api.dto;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.wot.fit.domain.FitFeedback;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

public class AddShoeRequestTest {
  private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

  @Test
  void validRequestHasNoViolations() {
    AddShoeRequest req = new AddShoeRequest();
    req.setBrand("Nike");
    req.setModel("Pegasus 40");
    req.setSize("EU 42");
    req.setFitFeedback(FitFeedback.PERFECT);

    assertTrue(validator.validate(req).isEmpty());
  }

  @Test
  void missingFieldsHaveViolations() {
    AddShoeRequest req = new AddShoeRequest();
    assertFalse(validator.validate(req).isEmpty());
  }
}

