package com.itcyber.careerportal.repository;

import com.itcyber.careerportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidateEmailOrderByAppliedAtDesc(String email);
    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);
    List<JobApplication> findAllByOrderByAppliedAtDesc();
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    long countByCandidateEmail(String email);
}
