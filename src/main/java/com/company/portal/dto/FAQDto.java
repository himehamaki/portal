package com.company.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * FAQ DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FAQDto {
    private Long id;
    private String question;
    private String answer;
    private Long categoryId;
    private String categoryName;
    private Integer displayOrder;
    private Boolean isVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
