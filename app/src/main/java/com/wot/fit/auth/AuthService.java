package com.wot.fit.auth;

import com.wot.fit.api.dto.AuthResponse;
import com.wot.fit.api.dto.LoginRequest;
import com.wot.fit.api.dto.RegisterRequest;
import com.wot.fit.domain.UserEntity;
import com.wot.fit.repository.UserRepository;
import com.wot.fit.service.ConflictException;
import com.wot.fit.service.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    String email = normalizeEmail(request.getEmail());
    if (userRepository.existsByEmailIgnoreCase(email)) {
      throw new ConflictException("EMAIL_ALREADY_EXISTS", "An account with this email already exists");
    }

    UserEntity user = new UserEntity();
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    UserEntity saved = userRepository.save(user);
    return toAuthResponse(saved);
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest request) {
    String email = normalizeEmail(request.getEmail());
    UserEntity user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new UnauthorizedException("INVALID_CREDENTIALS", "Invalid email or password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      throw new UnauthorizedException("INVALID_CREDENTIALS", "Invalid email or password");
    }

    return toAuthResponse(user);
  }

  private AuthResponse toAuthResponse(UserEntity user) {
    String token = jwtService.generateToken(user.getId(), user.getEmail());
    return new AuthResponse(token, user.getId(), user.getEmail());
  }

  private static String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}
