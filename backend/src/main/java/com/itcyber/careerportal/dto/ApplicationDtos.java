package com.itcyber.careerportal.dto;

import com.itcyber.careerportal.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public final class ApplicationDtos {
    private ApplicationDtos() {}
    public record ApplyRequest(Long jobId, String coverLetter) {}
    public record StatusUpdateRequest(@NotNull ApplicationStatus status) {}
}
