package com.itcyber.careerportal.dto;

import com.itcyber.careerportal.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Size(min = 6) String password,
        Role role,
        String companyName
    ) {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long id, String name, String email, Role role, String companyName) {}
}
