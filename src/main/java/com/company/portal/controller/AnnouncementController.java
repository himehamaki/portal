package com.company.portal.controller;

import com.company.portal.dto.AnnouncementDto;
import com.company.portal.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AnnouncementController {
    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<AnnouncementDto>> getPublished() {
        List<AnnouncementDto> announcements = announcementService.getPublished(null);
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<AnnouncementDto>> getByCategory(@PathVariable Long categoryId) {
        List<AnnouncementDto> announcements = announcementService.getPublishedByCategory(categoryId, null);
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDto> getById(@PathVariable Long id) {
        String userCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AnnouncementDto announcement = announcementService.getById(id, null);
        announcementService.markAsRead(id, null);
        return ResponseEntity.ok(announcement);
    }

    @PostMapping
    public ResponseEntity<AnnouncementDto> create(@RequestBody AnnouncementDto dto) {
        String userCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AnnouncementDto created = announcementService.create(dto, userCode);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDto> update(@PathVariable Long id, @RequestBody AnnouncementDto dto) {
        AnnouncementDto updated = announcementService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        String userCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        announcementService.markAsRead(id, null);
        return ResponseEntity.ok().build();
    }
}
