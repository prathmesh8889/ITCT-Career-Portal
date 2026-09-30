package com.itcyber.careerportal.controller;

import com.itcyber.careerportal.entity.Job;
import com.itcyber.careerportal.entity.JobApplication;
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
        this.users = users;
        this.jobs = jobs;
        this.applications = applications;
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
    public List<User> allUsers() {
        return users.findAll();
    }

    @PatchMapping("/users/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = users.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Admin role cannot be changed here");
        }
        String value = body.get("role");
        if (value == null) throw new IllegalArgumentException("Role is required");
        Role role = Role.valueOf(value.toUpperCase());
        if (role == Role.ADMIN) throw new IllegalArgumentException("Creating another admin is disabled");
        user.setRole(role);
        return users.save(user);
    }

    @GetMapping("/jobs")
    public List<Job> allJobs() {
        return jobs.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/applications")
    public List<JobApplication> allApplications() {
        return applications.findAllByOrderByAppliedAtDesc();
    }
}
