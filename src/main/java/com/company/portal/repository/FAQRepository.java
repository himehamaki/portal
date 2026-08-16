package com.company.portal.repository;

import com.company.portal.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FAQ リポジトリ
 */
@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    /**
     * 表示可能なFAQをカテゴリ別に取得
     */
    @Query("SELECT f FROM FAQ f WHERE f.category.id = :categoryId AND f.isVisible = true ORDER BY f.displayOrder ASC, f.createdAt DESC")
    List<FAQ> findByCategoryVisible(@Param("categoryId") Long categoryId);

    /**
     * 表示可能なすべてのFAQを取得
     */
    @Query("SELECT f FROM FAQ f WHERE f.isVisible = true ORDER BY f.displayOrder ASC, f.createdAt DESC")
    List<FAQ> findAllVisible();

    /**
     * 管理者向け：すべてのFAQを表示順で取得
     */
    List<FAQ> findByCategoryIdOrderByDisplayOrderAscCreatedAtDesc(Long categoryId);
}
