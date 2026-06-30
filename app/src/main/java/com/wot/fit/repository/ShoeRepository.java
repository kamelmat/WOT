package com.wot.fit.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.wot.fit.domain.ShoeEntity;

public interface ShoeRepository extends JpaRepository<ShoeEntity, Long> {
  @Query("select s from ShoeEntity s where s.fitProfile.publicId = :publicId order by s.createdAt asc")
  List<ShoeEntity> findAllByFitProfilePublicIdOrderByCreatedAtAsc(@Param("publicId") String publicId);
}

