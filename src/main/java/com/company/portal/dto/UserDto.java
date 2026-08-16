package com.company.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String userCode;
    private String name;
    private String email;
    private Long departmentId;
    private Boolean isActive;
    private Set<String> roles;
}
