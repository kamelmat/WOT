package com.wot.fit.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey key;
  private final long expiryHours;

  public JwtService(
      @Value("${wot.jwt.secret}") String secret,
      @Value("${wot.jwt.expiry-hours:168}") long expiryHours
  ) {
    if (secret.length() < 32) {
      throw new IllegalArgumentException("wot.jwt.secret must be at least 32 characters");
    }
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expiryHours = expiryHours;
  }

  public String generateToken(String userId, String email) {
    Instant now = Instant.now();
    return Jwts.builder()
        .subject(userId)
        .claim("email", email)
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plus(expiryHours, ChronoUnit.HOURS)))
        .signWith(key)
        .compact();
  }

  public AuthPrincipal parseToken(String token) {
    Claims claims = Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
    String userId = claims.getSubject();
    String email = claims.get("email", String.class);
    return new AuthPrincipal(userId, email);
  }
}
