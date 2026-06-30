package com.wot.fit.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.wot.fit.domain.FitProfileEntity;

public interface FitProfileRepository extends JpaRepository<FitProfileEntity, Long> {
  Optional<FitProfileEntity> findByPublicId(String publicId);

  Optional<FitProfileEntity> findFirstByUserIdOrderByUpdatedAtDesc(String userId);
}

