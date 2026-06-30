package com.wot.fit.controller;

import java.time.OffsetDateTime;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
  @GetMapping({"/health", "/health/live"})
  public ResponseEntity<Map<String, Object>> live() {
    return ResponseEntity.ok(Map.of(
        "status", "UP",
        "timestamp", OffsetDateTime.now().toString()
    ));
  }

  @GetMapping({"/health/ready", "/v1/fit/health"})
  public ResponseEntity<Map<String, Object>> ready() {
    return ResponseEntity.ok(Map.of(
        "status", "READY",
        "timestamp", OffsetDateTime.now().toString()
    ));
  }
}

