package com.itcyber.careerportal.repository;

import com.itcyber.careerportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByActiveTrueOrderByCreatedAtDesc();
    List<Job> findByCreatedByEmailOrderByCreatedAtDesc(String email);
    List<Job> findAllByOrderByCreatedAtDesc();
    long countByActiveTrue();
}
