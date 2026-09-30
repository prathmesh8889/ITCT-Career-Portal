package com.itcyber.careerportal.service;

import com.itcyber.careerportal.dto.ApplicationDtos.ApplyRequest;
import com.itcyber.careerportal.entity.*;
import com.itcyber.careerportal.repository.JobApplicationRepository;
import com.itcyber.careerportal.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationService {
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobService jobService;

    public ApplicationService(JobApplicationRepository applicationRepository, UserRepository userRepository, JobService jobService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobService = jobService;
    }

    public JobApplication apply(ApplyRequest req, String email) {
        User candidate = userRepository.findByEmail(email).orElseThrow();
        if (candidate.getRole() != Role.CANDIDATE) throw new AccessDeniedException("Only candidates can apply");
        Job job = jobService.get(req.jobId());
        if (!job.isActive()) throw new IllegalArgumentException("This job is closed");
        if (applicationRepository.existsByJobIdAndCandidateId(job.getId(), candidate.getId())) {
            throw new IllegalArgumentException("You already applied for this job");
        }
        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setCandidate(candidate);
        app.setCoverLetter(req.coverLetter());
        return applicationRepository.save(app);
    }

    public List<JobApplication> mine(String email) {
        return applicationRepository.findByCandidateEmailOrderByAppliedAtDesc(email);
    }

    public List<JobApplication> forJob(Long jobId, String email) {
        Job job = jobService.get(jobId);
        jobService.assertOwnerOrAdmin(job, email);
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public JobApplication updateStatus(Long id, ApplicationStatus status, String email) {
        JobApplication app = applicationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Application not found"));
        jobService.assertOwnerOrAdmin(app.getJob(), email);
        app.setStatus(status);
        return applicationRepository.save(app);
    }
}
