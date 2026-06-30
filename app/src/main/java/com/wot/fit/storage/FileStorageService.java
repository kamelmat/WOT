package com.wot.fit.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private static final long MAX_BYTES = 5L * 1024L * 1024L; // 5 MB

  private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif"
  );

  private final Path uploadDir;

  public FileStorageService(@Value("${wot.upload-dir}") String uploadDir) {
    this.uploadDir = Paths.get(uploadDir);
  }

  /**
   * Stores a user-provided image and returns a public URL path like `/uploads/<filename>`.
   */
  public String storeShoeImage(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      return null;
    }
    if (file.getSize() > MAX_BYTES) {
      throw new IllegalArgumentException("Image too large");
    }
    String contentType = file.getContentType();
    if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
      throw new IllegalArgumentException("Unsupported image type");
    }

    String original = file.getOriginalFilename();
    String ext = "";
    if (original != null) {
      int idx = original.lastIndexOf('.');
      if (idx >= 0 && idx < original.length() - 1) {
        ext = original.substring(idx + 1).toLowerCase();
      }
    }
    if (ext.isBlank()) {
      ext = "img";
    }

    String filename = UUID.randomUUID().toString() + "." + ext;
    try {
      Files.createDirectories(uploadDir);
      Path target = uploadDir.resolve(filename);
      Files.copy(file.getInputStream(), target);
    } catch (IOException e) {
      throw new RuntimeException("Failed to store image", e);
    }

    return "/uploads/" + filename;
  }
}

