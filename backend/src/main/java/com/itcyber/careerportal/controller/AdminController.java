package com.itcyber.careerportal.controller;

import com.itcyber.careerportal.entity.Job;
import com.itcyber.careerportal.entity.JobApplication;
import com.itcyber.careerportal.entity.Role;
import com.itcyber.careerportal.entity.User;
import com.itcyber.careerportal.repository.JobApplicationRepository;
import com.itcyber.careerportal.repository.JobRepository;
import com.itcyber.careerportal.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder encoder;

    public AdminController(UserRepository users, JobRepository jobs, JobApplicationRepository applications, PasswordEncoder encoder) {
        this.users = users;
        this.jobs = jobs;
        this.applications = applications;
        this.encoder = encoder;
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

    @PatchMapping("/credentials")
    public Map<String, String> updateCredentials(@RequestBody Map<String, String> body, Authentication auth) {
        User admin = users.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        String currentPassword = body.get("currentPassword");
        if (currentPassword == null || currentPassword.isBlank() || !encoder.matches(currentPassword, admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        String newEmail = body.get("newEmail");
        String newPassword = body.get("newPassword");
        boolean changed = false;

        if (newEmail != null && !newEmail.isBlank()) {
            String normalized = newEmail.trim().toLowerCase();
            if (!normalized.equals(admin.getEmail())) {
                if (users.findByEmail(normalized).isPresent()) {
                    throw new IllegalArgumentException("This login email is already in use");
                }
                admin.setEmail(normalized);
                changed = true;
            }
        }

        if (newPassword != null && !newPassword.isBlank()) {
            if (newPassword.length() < 8) {
                throw new IllegalArgumentException("New password must be at least 8 characters");
            }
            admin.setPassword(encoder.encode(newPassword));
            changed = true;
        }

        if (!changed) {
            throw new IllegalArgumentException("No credential changes requested");
        }

        users.save(admin);
        return Map.of(
            "message", "Admin credentials updated successfully",
            "email", admin.getEmail()
        );
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
