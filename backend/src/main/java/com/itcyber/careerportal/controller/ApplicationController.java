package com.itcyber.careerportal.controller;

import com.itcyber.careerportal.dto.ApplicationDtos.*;
import com.itcyber.careerportal.entity.JobApplication;
import com.itcyber.careerportal.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    public ApplicationController(ApplicationService applicationService) { this.applicationService = applicationService; }

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public JobApplication apply(@RequestBody ApplyRequest request, Authentication auth) {
        return applicationService.apply(request, auth.getName());
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<JobApplication> mine(Authentication auth) { return applicationService.mine(auth.getName()); }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    public List<JobApplication> forJob(@PathVariable Long jobId, Authentication auth) {
        return applicationService.forJob(jobId, auth.getName());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    public JobApplication updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request, Authentication auth) {
        return applicationService.updateStatus(id, request.status(), auth.getName());
    }
}
