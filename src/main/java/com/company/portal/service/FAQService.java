package com.company.portal.service;

import com.company.portal.entity.FAQ;
import com.company.portal.entity.Category;
import com.company.portal.dto.FAQDto;
import com.company.portal.repository.FAQRepository;
import com.company.portal.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * FAQ サービス
 * 管理者向けCRUD操作とユーザー向け閲覧機能
 */
@Service
public class FAQService {
    @Autowired
    private FAQRepository faqRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * FAQ を新規作成（管理者用）
     */
    @Transactional
    public FAQDto create(FAQDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        FAQ faq = new FAQ();
        faq.setQuestion(dto.getQuestion());
        faq.setAnswer(dto.getAnswer());
        faq.setCategory(category);
        faq.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        faq.setIsVisible(dto.getIsVisible() != null ? dto.getIsVisible() : true);

        FAQ saved = faqRepository.save(faq);
        return convertToDto(saved);
    }

    /**
     * FAQ を更新（管理者用）
     */
    @Transactional
    public FAQDto update(Long id, FAQDto dto) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));

        faq.setQuestion(dto.getQuestion());
        faq.setAnswer(dto.getAnswer());
        faq.setDisplayOrder(dto.getDisplayOrder());
        faq.setIsVisible(dto.getIsVisible());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            faq.setCategory(category);
        }

        FAQ saved = faqRepository.save(faq);
        return convertToDto(saved);
    }

    /**
     * FAQ を削除（管理者用）
     */
    @Transactional
    public void delete(Long id) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        faqRepository.delete(faq);
    }

    /**
     * FAQ を ID で取得（管理者用：全てのFAQが見える）
     */
    @Transactional(readOnly = true)
    public FAQDto getById(Long id) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found"));
        return convertToDto(faq);
    }

    /**
     * 表示可能なすべての FAQ を取得（ユーザー用）
     */
    @Transactional(readOnly = true)
    public List<FAQDto> getAll() {
        List<FAQ> faqs = faqRepository.findAllVisible();
        return faqs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * カテゴリ別に表示可能な FAQ を取得（ユーザー用）
     */
    @Transactional(readOnly = true)
    public List<FAQDto> getByCategory(Long categoryId) {
        List<FAQ> faqs = faqRepository.findByCategoryVisible(categoryId);
        return faqs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * カテゴリ別にすべての FAQ を取得（管理者用）
     */
    @Transactional(readOnly = true)
    public List<FAQDto> getByCategoryAdmin(Long categoryId) {
        List<FAQ> faqs = faqRepository.findByCategoryIdOrderByDisplayOrderAscCreatedAtDesc(categoryId);
        return faqs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * DTO に変換
     */
    private FAQDto convertToDto(FAQ faq) {
        return FAQDto.builder()
                .id(faq.getId())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .categoryId(faq.getCategory().getId())
                .categoryName(faq.getCategory().getName())
                .displayOrder(faq.getDisplayOrder())
                .isVisible(faq.getIsVisible())
                .createdAt(faq.getCreatedAt())
                .updatedAt(faq.getUpdatedAt())
                .build();
    }
}
