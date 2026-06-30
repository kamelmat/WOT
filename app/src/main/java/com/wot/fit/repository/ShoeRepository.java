package com.wot.fit.repository;

import com.wot.fit.domain.FitFeedback;
import com.wot.fit.domain.ShoeEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShoeRepository extends JpaRepository<ShoeEntity, Long> {
  @Query("select s from ShoeEntity s where s.fitProfile.publicId = :publicId order by s.createdAt asc")
  List<ShoeEntity> findAllByFitProfilePublicIdOrderByCreatedAtAsc(@Param("publicId") String publicId);

  @Query("""
      select s from ShoeEntity s
      join fetch s.fitProfile p
      where s.fitFeedback = :feedback
        and p.userId <> :excludeUserId
      order by s.createdAt desc
      """)
  List<ShoeEntity> findPerfectShoesFromOtherUsers(
      @Param("excludeUserId") String excludeUserId,
      @Param("feedback") FitFeedback feedback
  );

  default List<ShoeEntity> findPerfectShoesFromOtherUsers(String excludeUserId) {
    return findPerfectShoesFromOtherUsers(excludeUserId, FitFeedback.PERFECT);
  }
}
