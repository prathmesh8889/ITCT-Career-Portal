package com.itcyber.careerportal.service;

import com.itcyber.careerportal.dto.JobDtos.JobRequest;
import com.itcyber.careerportal.entity.Job;
import com.itcyber.careerportal.entity.Role;
import com.itcyber.careerportal.entity.User;
import com.itcyber.careerportal.repository.JobRepository;
import com.itcyber.careerportal.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public List<Job> activeJobs() { return jobRepository.findByActiveTrueOrderByCreatedAtDesc(); }

    public Job get(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public List<Job> mine(String email) {
        return jobRepository.findByCreatedByEmailOrderByCreatedAtDesc(email);
    }

    public Job create(JobRequest req, String email) {
        User creator = requireAdmin(email);
        Job job = new Job();
        apply(job, req);
        job.setCreatedBy(creator);
        return jobRepository.save(job);
    }

    public Job update(Long id, JobRequest req, String email) {
        requireAdmin(email);
        Job job = get(id);
        apply(job, req);
        return jobRepository.save(job);
    }

    public void delete(Long id, String email) {
        requireAdmin(email);
        Job job = get(id);
        job.setActive(false);
        jobRepository.save(job);
    }

    public void assertOwnerOrAdmin(Job job, String email) {
        User actor = userRepository.findByEmail(email).orElseThrow();
        if (actor.getRole() != Role.ADMIN && !job.getCreatedBy().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Not allowed for this job");
        }
    }

    private User requireAdmin(String email) {
        User actor = userRepository.findByEmail(email).orElseThrow();
        if (actor.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admin can manage job posts");
        }
        return actor;
    }

    private void apply(Job job, JobRequest req) {
        job.setTitle(req.title());
        job.setCompany(req.company());
        job.setLocation(req.location());
        job.setType(req.type());
        job.setSalary(req.salary());
        job.setDescription(req.description());
        job.setRequirements(req.requirements());
    }
}
