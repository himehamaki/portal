package com.company.portal.service;

import com.company.portal.entity.Announcement;
import com.company.portal.entity.AnnouncementRead;
import com.company.portal.entity.Category;
import com.company.portal.entity.User;
import com.company.portal.dto.AnnouncementDto;
import com.company.portal.repository.AnnouncementRepository;
import com.company.portal.repository.AnnouncementReadRepository;
import com.company.portal.repository.CategoryRepository;
import com.company.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {
    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private AnnouncementReadRepository announcementReadRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AnnouncementDto create(AnnouncementDto dto, String authorUserCode) {
        User author = userRepository.findByUserCode(authorUserCode)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Announcement announcement = new Announcement();
        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setCategory(category);
        announcement.setAuthor(author);
        announcement.setImageUrl(dto.getImageUrl());
        announcement.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");
        announcement.setIsImportant(dto.getIsImportant() != null ? dto.getIsImportant() : false);

        if ("PUBLISHED".equals(announcement.getStatus())) {
            announcement.setPublishedAt(LocalDateTime.now());
        }

        Announcement saved = announcementRepository.save(announcement);
        return convertToDto(saved, null);
    }

    @Transactional
    public AnnouncementDto update(Long id, AnnouncementDto dto) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setImageUrl(dto.getImageUrl());
        announcement.setIsImportant(dto.getIsImportant());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            announcement.setCategory(category);
        }

        if ("PUBLISHED".equals(dto.getStatus()) && !"PUBLISHED".equals(announcement.getStatus())) {
            announcement.setStatus("PUBLISHED");
            announcement.setPublishedAt(LocalDateTime.now());
        } else if (dto.getStatus() != null) {
            announcement.setStatus(dto.getStatus());
        }

        Announcement saved = announcementRepository.save(announcement);
        return convertToDto(saved, null);
    }

    @Transactional
    public void delete(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        announcementRepository.delete(announcement);
    }

    @Transactional(readOnly = true)
    public AnnouncementDto getById(Long id, Long userId) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        return convertToDto(announcement, userId);
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getPublished(Long userId) {
        List<Announcement> announcements = announcementRepository.findAllPublished();
        return announcements.stream()
                .map(a -> convertToDto(a, userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getPublishedByCategory(Long categoryId, Long userId) {
        List<Announcement> announcements = announcementRepository.findByCategoryPublished(categoryId);
        return announcements.stream()
                .map(a -> convertToDto(a, userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getDrafts(String authorUserCode) {
        User author = userRepository.findByUserCode(authorUserCode)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Announcement> announcements = announcementRepository.findByStatusOrderByPublishedAtDesc("DRAFT")
                .stream()
                .filter(a -> a.getAuthor().getId().equals(author.getId()))
                .collect(Collectors.toList());
        return announcements.stream()
                .map(a -> convertToDto(a, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long announcementId, Long userId) {
        if (announcementReadRepository.findByAnnouncementIdAndUserId(announcementId, userId).isEmpty()) {
            Announcement announcement = announcementRepository.findById(announcementId)
                    .orElseThrow(() -> new RuntimeException("Announcement not found"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            AnnouncementRead read = new AnnouncementRead();
            read.setAnnouncement(announcement);
            read.setUser(user);
            announcementReadRepository.save(read);
        }
    }

    private AnnouncementDto convertToDto(Announcement announcement, Long userId) {
        boolean isRead = false;
        if (userId != null) {
            isRead = announcementReadRepository.findByAnnouncementIdAndUserId(announcement.getId(), userId).isPresent();
        }

        long readCount = announcementReadRepository.countByAnnouncementId(announcement.getId());

        return AnnouncementDto.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .categoryId(announcement.getCategory().getId())
                .categoryName(announcement.getCategory().getName())
                .authorId(announcement.getAuthor().getId())
                .authorName(announcement.getAuthor().getName())
                .imageUrl(announcement.getImageUrl())
                .status(announcement.getStatus())
                .isImportant(announcement.getIsImportant())
                .publishedAt(announcement.getPublishedAt())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .isRead(isRead)
                .readCount(readCount)
                .build();
    }
}
