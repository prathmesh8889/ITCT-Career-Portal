package com.itcyber.careerportal.service;

import com.itcyber.careerportal.dto.AuthDtos.*;
import com.itcyber.careerportal.entity.Role;
import com.itcyber.careerportal.entity.User;
import com.itcyber.careerportal.repository.UserRepository;
import com.itcyber.careerportal.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }
        Role role = req.role() == null ? Role.CANDIDATE : req.role();
        if (role == Role.ADMIN) throw new IllegalArgumentException("Admin self-registration is disabled");

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(role);
        user.setCompanyName(req.companyName());
        userRepository.save(user);
        return response(user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.email().toLowerCase(), req.password()));
        User user = userRepository.findByEmail(req.email().toLowerCase()).orElseThrow();
        return response(user);
    }

    private AuthResponse response(User user) {
        return new AuthResponse(jwtService.generateToken(user.getEmail()), user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCompanyName());
    }
}
