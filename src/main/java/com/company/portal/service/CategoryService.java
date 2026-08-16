package com.company.portal.service;

import com.company.portal.entity.Category;
import com.company.portal.dto.CategoryDto;
import com.company.portal.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public CategoryDto create(CategoryDto dto) {
        Category category = new Category();
        category.setType(dto.getType());
        category.setName(dto.getName());
        category.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        category.setIsVisible(dto.getIsVisible() != null ? dto.getIsVisible() : true);

        Category saved = categoryRepository.save(category);
        return convertToDto(saved);
    }

    @Transactional
    public CategoryDto update(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(dto.getName());
        category.setDisplayOrder(dto.getDisplayOrder());
        category.setIsVisible(dto.getIsVisible());

        Category saved = categoryRepository.save(category);
        return convertToDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public CategoryDto getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToDto(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getByType(String type) {
        List<Category> categories = categoryRepository.findByTypeOrderByDisplayOrder(type);
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getByTypeAndVisible(String type) {
        List<Category> categories = categoryRepository.findByTypeAndIsVisibleOrderByDisplayOrder(type, true);
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CategoryDto convertToDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .type(category.getType())
                .name(category.getName())
                .displayOrder(category.getDisplayOrder())
                .isVisible(category.getIsVisible())
                .build();
    }
}
