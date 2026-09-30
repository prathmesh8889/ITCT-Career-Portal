package com.itcyber.careerportal.repository;

import com.itcyber.careerportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(com.itcyber.careerportal.entity.Role role);
}
