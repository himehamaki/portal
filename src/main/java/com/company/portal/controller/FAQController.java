package com.company.portal.controller;

import com.company.portal.dto.FAQDto;
import com.company.portal.service.FAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FAQ コントローラー
 * ユーザー向け閲覧と管理者向けCRUD
 */
@RestController
@RequestMapping("/api/faqs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FAQController {
    @Autowired
    private FAQService faqService;

    /**
     * 表示可能なすべての FAQ を取得（ユーザー向け）
     */
    @GetMapping
    public ResponseEntity<List<FAQDto>> getAll() {
        List<FAQDto> faqs = faqService.getAll();
        return ResponseEntity.ok(faqs);
    }

    /**
     * カテゴリ別に表示可能な FAQ を取得（ユーザー向け）
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FAQDto>> getByCategory(@PathVariable Long categoryId) {
        List<FAQDto> faqs = faqService.getByCategory(categoryId);
        return ResponseEntity.ok(faqs);
    }

    /**
     * FAQ 詳細を取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<FAQDto> getById(@PathVariable Long id) {
        FAQDto faq = faqService.getById(id);
        return ResponseEntity.ok(faq);
    }

    /**
     * FAQ を新規作成（管理者用）
     */
    @PostMapping
    public ResponseEntity<FAQDto> create(@RequestBody FAQDto dto) {
        FAQDto created = faqService.create(dto);
        return ResponseEntity.ok(created);
    }

    /**
     * FAQ を更新（管理者用）
     */
    @PutMapping("/{id}")
    public ResponseEntity<FAQDto> update(@PathVariable Long id, @RequestBody FAQDto dto) {
        FAQDto updated = faqService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * FAQ を削除（管理者用）
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * カテゴリ別にすべての FAQ を取得（管理者用）
     */
    @GetMapping("/admin/category/{categoryId}")
    public ResponseEntity<List<FAQDto>> getByCategoryAdmin(@PathVariable Long categoryId) {
        List<FAQDto> faqs = faqService.getByCategoryAdmin(categoryId);
        return ResponseEntity.ok(faqs);
    }
}
