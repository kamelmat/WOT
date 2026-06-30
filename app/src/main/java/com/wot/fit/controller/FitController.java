package com.wot.fit.controller;

import com.wot.fit.api.dto.AddShoeRequest;
import com.wot.fit.api.dto.AddShoeResponse;
import com.wot.fit.api.dto.FitProfileSummaryResponse;
import com.wot.fit.api.dto.UpdateProfileRequest;
import com.wot.fit.api.dto.UpdateProfileResponse;
import com.wot.fit.api.dto.RecommendationsResponse;
import com.wot.fit.api.dto.ValidateFitRequest;
import com.wot.fit.api.dto.ValidateFitResponse;
import com.wot.fit.auth.AuthPrincipal;
import com.wot.fit.domain.FitProfileEntity;
import com.wot.fit.service.FitService;
import com.wot.fit.service.UnauthorizedException;
import com.wot.fit.storage.FileStorageService;
import java.time.OffsetDateTime;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

@RestController
@RequestMapping("${wot.api.base-path:/api/v1/fit}")
public class FitController {
  private final FitService fitService;
  private final FileStorageService fileStorageService;

  public FitController(FitService fitService, FileStorageService fileStorageService) {
    this.fitService = fitService;
    this.fileStorageService = fileStorageService;
  }

  @GetMapping("/profile/me")
  public ResponseEntity<FitProfileSummaryResponse> myProfile(@AuthenticationPrincipal AuthPrincipal principal) {
    AuthPrincipal user = requirePrincipal(principal);
    return fitService.findProfileForUser(user.userId())
        .map(profile -> ResponseEntity.ok(new FitProfileSummaryResponse(profile.getPublicId(), profile.getConfidence())))
        .orElseGet(() -> ResponseEntity.ok(new FitProfileSummaryResponse(null, null)));
  }

  @PostMapping("/add-shoe")
  public ResponseEntity<AddShoeResponse> addShoe(
      @AuthenticationPrincipal AuthPrincipal principal,
      @Valid @RequestBody AddShoeRequest request
  ) {
    AuthPrincipal user = requirePrincipal(principal);
    FitProfileEntity profile = fitService.addShoe(user.userId(), request);
    AddShoeResponse response = new AddShoeResponse(
        "FIT_RECORDED",
        profile.getPublicId(),
        profile.getConfidence(),
        OffsetDateTime.now().toString()
    );
    return ResponseEntity.ok(response);
  }

  @PostMapping(value = "/add-shoe-with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<AddShoeResponse> addShoeWithImage(
      @AuthenticationPrincipal AuthPrincipal principal,
      @Valid @org.springframework.web.bind.annotation.RequestPart("request") AddShoeRequest request,
      @org.springframework.web.bind.annotation.RequestPart(value = "image", required = false) MultipartFile image
  ) {
    AuthPrincipal user = requirePrincipal(principal);
    String imageUrl = fileStorageService.storeShoeImage(image);
    FitProfileEntity profile = fitService.addShoe(user.userId(), request, imageUrl);
    AddShoeResponse response = new AddShoeResponse(
        "FIT_RECORDED",
        profile.getPublicId(),
        profile.getConfidence(),
        OffsetDateTime.now().toString()
    );
    return ResponseEntity.ok(response);
  }

  @PostMapping("/validate")
  public ResponseEntity<ValidateFitResponse> validate(
      @AuthenticationPrincipal AuthPrincipal principal,
      @Valid @RequestBody ValidateFitRequest request
  ) {
    AuthPrincipal user = requirePrincipal(principal);
    FitProfileEntity profile = fitService.validateProfile(request.getFitProfileId(), user.userId());
    ValidateFitResponse response = new ValidateFitResponse(
        "VALIDATED",
        profile.getPublicId(),
        profile.getConfidence(),
        profile.getProfileState().name()
    );
    return ResponseEntity.ok(response);
  }

  @GetMapping("/recommendations")
  public ResponseEntity<RecommendationsResponse> recommendations(
      @AuthenticationPrincipal AuthPrincipal principal,
      @RequestParam("fitProfileId") String fitProfileId
  ) {
    AuthPrincipal user = requirePrincipal(principal);
    FitService.Recommendations recs = fitService.recommendations(fitProfileId, user.userId());
    return ResponseEntity.ok(new RecommendationsResponse(recs.recommendations(), recs.confidence()));
  }

  @PutMapping("/profile/{fitProfileId}")
  public ResponseEntity<UpdateProfileResponse> updateProfile(
      @AuthenticationPrincipal AuthPrincipal principal,
      @PathVariable("fitProfileId") String fitProfileId,
      @Valid @RequestBody UpdateProfileRequest request
  ) {
    AuthPrincipal user = requirePrincipal(principal);
    FitProfileEntity profile = fitService.updateProfilePain(fitProfileId, user.userId(), request.getPain());
    return ResponseEntity.ok(new UpdateProfileResponse("PROFILE_UPDATED", profile.getPublicId()));
  }

  private static AuthPrincipal requirePrincipal(AuthPrincipal principal) {
    if (principal == null) {
      throw new UnauthorizedException("UNAUTHORIZED", "Authentication required");
    }
    return principal;
  }
}
