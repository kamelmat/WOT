package com.wot.fit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.wot.fit.domain.FitFeedback;
import com.wot.fit.domain.ShoeEntity;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

public class FitConfidenceCalculatorTest {
  @Test
  void emptyShoesGivesZeroLowConfidence() {
    FitConfidenceCalculator.ConfidenceResult r = FitConfidenceCalculator.calculate(List.of());
    assertEquals(0, r.confidence().compareTo(BigDecimal.ZERO));
    assertEquals("LOW_CONFIDENCE", r.profileState().name());
  }

  @Test
  void moreShoesAndConsistencyIncreaseConfidence() {
    ShoeEntity a = shoe(FitFeedback.PERFECT);
    ShoeEntity b = shoe(FitFeedback.PERFECT);
    ShoeEntity c = shoe(FitFeedback.TIGHT);

    BigDecimal c1 = FitConfidenceCalculator.calculate(List.of(a)).confidence();
    BigDecimal c3 = FitConfidenceCalculator.calculate(List.of(a, b, c)).confidence();

    assertTrue(c3.compareTo(c1) > 0);
  }

  private static ShoeEntity shoe(FitFeedback fb) {
    ShoeEntity s = new ShoeEntity();
    s.setFitFeedback(fb);
    s.setBrand("B");
    s.setModel("M");
    s.setSize("EU 42");
    return s;
  }
}

