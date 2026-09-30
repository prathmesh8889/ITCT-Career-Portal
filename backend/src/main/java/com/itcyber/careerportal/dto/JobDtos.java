package com.itcyber.careerportal.dto;

import com.itcyber.careerportal.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class JobDtos {
    private JobDtos() {}

    public record JobRequest(
        @NotBlank String title,
        @NotBlank String company,
        @NotBlank String location,
        @NotNull JobType type,
        String salary,
        @NotBlank String description,
        String requirements
    ) {}
}
