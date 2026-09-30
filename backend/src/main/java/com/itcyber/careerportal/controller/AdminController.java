package com.itcyber.careerportal.controller;

import com.itcyber.careerportal.entity.Role;
import com.itcyber.careerportal.entity.User;
import com.itcyber.careerportal.repository.JobApplicationRepository;
import com.itcyber.careerportal.repository.JobRepository;
import com.itcyber.careerportal.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository users;
    private final JobRepository jobs;
    private final JobApplicationRepository applications;

    public AdminController(UserRepository users, JobRepository jobs, JobApplicationRepository applications) {
        this.users = users; this.jobs = jobs; this.applications = applications;
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of(
            "users", users.count(),
            "candidates", users.countByRole(Role.CANDIDATE),
            "recruiters", users.countByRole(Role.RECRUITER),
            "activeJobs", jobs.countByActiveTrue(),
            "applications", applications.count()
        );
    }

    @GetMapping("/users")
    public List<User> allUsers() { return users.findAll(); }
}
