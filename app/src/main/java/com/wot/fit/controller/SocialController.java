package com.wot.fit.controller;

import com.wot.fit.api.dto.SocialSuggestionsResponse;
import com.wot.fit.auth.AuthPrincipal;
import com.wot.fit.service.SocialService;
import com.wot.fit.service.UnauthorizedException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${wot.api.base-path:/api/v1/fit}/social")
public class SocialController {
  private final SocialService socialService;

  public SocialController(SocialService socialService) {
    this.socialService = socialService;
  }

  @GetMapping("/suggestions")
  public ResponseEntity<SocialSuggestionsResponse> suggestions(
      @AuthenticationPrincipal AuthPrincipal principal,
      @RequestParam(value = "pain", defaultValue = "") String pain
  ) {
    AuthPrincipal user = requirePrincipal(principal);
    return ResponseEntity.ok(
        new SocialSuggestionsResponse(socialService.suggestions(user.userId(), pain))
    );
  }

  private static AuthPrincipal requirePrincipal(AuthPrincipal principal) {
    if (principal == null) {
      throw new UnauthorizedException("UNAUTHORIZED", "Authentication required");
    }
    return principal;
  }
}
