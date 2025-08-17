package com.pdfsigner.pdf_signer.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pdfsigner.pdf_signer.dto.RegisterRequest;
import com.pdfsigner.pdf_signer.model.Role;
import com.pdfsigner.pdf_signer.model.User;
import com.pdfsigner.pdf_signer.repository.UserRepository;
import com.pdfsigner.pdf_signer.request.LoginRequest;
import com.pdfsigner.pdf_signer.util.JwtUtil;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private MyUserDetailsService userDetailsService;
    private JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            MyUserDetailsService userDetailsService,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    // public User registerUser(RegisterRequest registerRequest) {
    // // Check if username or email already exists
    // if (userRepository.existsByUsername(registerRequest.getUsername())) {
    // throw new RuntimeException("Username already exists");
    // }
    // if (userRepository.existsByEmail(registerRequest.getEmail())) {
    // throw new RuntimeException("Email already exists");
    // }

    // // Create new User entity
    // User user = new User();
    // user.setUsername(registerRequest.getUsername());
    // user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); //
    // Encode password
    // user.setEmail(registerRequest.getEmail());
    // user.setCreatedAt(LocalDateTime.now());

    // // Assign default role (e.g., ROLE_USER)
    // user.setRoles(Collections.singleton(Role.ROLE_USER)); // Ensure Role enum
    // exists

    // return userRepository.save(user);
    // }

    public User registerUser(RegisterRequest registerRequest) {
        // Log received values
        log.info("Registering user: {}", registerRequest.getEmail());
        log.info("Username: {}", registerRequest.getUsername());
        log.info("Password present: {}", registerRequest.getPassword() != null);

        // Check for null password
        if (registerRequest.getPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }

        // Check if username or email already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user entity
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setRoles(Set.of(Role.USER));

        return userRepository.save(user);
    }

    // public User getUserByUsername(String username) {
    // return userRepository.findByUsername(username)
    // .orElseThrow(() -> new RuntimeException("User not found"));
    // }

    public User getUserByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // public User login(User user) {
    // User foundUser = userRepository.findByEmail(user.getEmail())
    // .orElseThrow(() -> new RuntimeException("User not found"));

    // userRepository.save(foundUser);
    // if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
    // throw new RuntimeException("Invalid password");
    // }
    // return foundUser;

    // }

    // public Map<String, Object> login(LoginRequest loginRequest) {
    // User user = userRepository.findByEmail(loginRequest.getEmail())
    // .orElseThrow(
    // () -> new UsernameNotFoundException("User not found with email: " +
    // loginRequest.getEmail()));

    // if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
    // {
    // throw new BadCredentialsException("Invalid email or password");
    // }
    // // For JWT generation we still need a UserDetails object
    // UserDetails userDetails =
    // userDetailsService.loadUserByUsername(user.getEmail());
    // String token = jwtUtil.generateToken(userDetails);

    // Map<String, Object> response = new HashMap<>();
    // response.put("token", token);
    // response.put("user", Map.of(
    // "id", user.getId(),
    // "email", user.getEmail(),
    // "username", user.getUsername()));

    // return response;
    // }

    public Map<String, Object> login(LoginRequest loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    log.warn("User not found for email: {}", loginRequest.getEmail());
                    return new UsernameNotFoundException("User not found");
                });

        log.info("User found: {}", user.getEmail());
        log.info("Stored password hash: {}", user.getPassword());
        log.info("Provided password: {}", loginRequest.getPassword());

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Password mismatch for user: {}", user.getEmail());
            throw new BadCredentialsException("Invalid credentials");
        }

        log.info("Password matches for user: {}", user.getEmail());

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        log.info("User authorities: {}", userDetails.getAuthorities());

        String token = jwtUtil.generateToken(userDetails);
        log.info("Generated JWT token: {}", token);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "username", user.getUsername()));

        return response;
    }
}
