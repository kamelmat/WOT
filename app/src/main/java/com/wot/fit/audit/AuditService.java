package com.wot.fit.audit;

import com.wot.fit.config.TraceIdFilter;
import java.time.OffsetDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
  private static final Logger log = LoggerFactory.getLogger(AuditService.class);

  public void record(String eventType, String status, String subjectId) {
    String maskedSubject = mask(subjectId);
    String traceId = MDC.get(TraceIdFilter.MDC_KEY);
    AuditEvent event = new AuditEvent(eventType, status, maskedSubject, OffsetDateTime.now());
    log.info("AUDIT eventType={} status={} subjectId={} traceId={} timestamp={}",
        event.getEventType(), event.getStatus(), event.getSubjectId(), traceId, event.getTimestamp());
  }

  private static String mask(String value) {
    if (value == null || value.isBlank()) {
      return "UNKNOWN";
    }
    if (value.length() <= 4) {
      return "****";
    }
    return value.substring(0, 2) + "****" + value.substring(value.length() - 2);
  }
}

