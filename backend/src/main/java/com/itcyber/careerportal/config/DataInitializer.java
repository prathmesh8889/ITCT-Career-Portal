package com.itcyber.careerportal.config;

import com.itcyber.careerportal.entity.Role;
import com.itcyber.careerportal.entity.User;
import com.itcyber.careerportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedAdmin(UserRepository users, PasswordEncoder encoder,
                                @Value("${app.admin.email:admin@careerportal.local}") String email,
                                @Value("${app.admin.password:Admin@123}") String password) {
        return args -> {
            if (!users.existsByEmail(email.toLowerCase())) {
                User admin = new User();
                admin.setName("Portal Admin");
                admin.setEmail(email.toLowerCase());
                admin.setPassword(encoder.encode(password));
                admin.setRole(Role.ADMIN);
                users.save(admin);
            }
        };
    }
}
