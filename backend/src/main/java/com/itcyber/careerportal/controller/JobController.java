package com.itcyber.careerportal.controller;

import com.itcyber.careerportal.dto.JobDtos.JobRequest;
import com.itcyber.careerportal.entity.Job;
import com.itcyber.careerportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService jobService;
    public JobController(JobService jobService) { this.jobService = jobService; }

    @GetMapping
    public List<Job> all() { return jobService.activeJobs(); }

    @GetMapping("/{id}")
    public Job one(@PathVariable Long id) { return jobService.get(id); }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Job> mine(Authentication auth) { return jobService.mine(auth.getName()); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Job create(@Valid @RequestBody JobRequest request, Authentication auth) {
        return jobService.create(request, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Job update(@PathVariable Long id, @Valid @RequestBody JobRequest request, Authentication auth) {
        return jobService.update(id, request, auth.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id, Authentication auth) {
        jobService.delete(id, auth.getName());
    }
}
