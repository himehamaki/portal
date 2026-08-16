package com.company.portal.repository;

import com.company.portal.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByStatusOrderByPublishedAtDesc(String status);
    
    List<Announcement> findByCategoryIdAndStatusOrderByPublishedAtDesc(Long categoryId, String status);
    
    @Query("SELECT a FROM Announcement a WHERE a.status = 'PUBLISHED' ORDER BY a.publishedAt DESC")
    List<Announcement> findAllPublished();
    
    @Query("SELECT a FROM Announcement a WHERE a.category.id = :categoryId AND a.status = 'PUBLISHED' ORDER BY a.publishedAt DESC")
    List<Announcement> findByCategoryPublished(@Param("categoryId") Long categoryId);
}
