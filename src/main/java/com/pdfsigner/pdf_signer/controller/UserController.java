package com.pdfsigner.pdf_signer.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;

import com.pdfsigner.pdf_signer.dto.RegisterRequest;
import com.pdfsigner.pdf_signer.model.User;
import com.pdfsigner.pdf_signer.request.LoginRequest;
import com.pdfsigner.pdf_signer.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // @PostMapping("/register")
    // public ResponseEntity<?> registerUser(@RequestBody RegisterRequest user) {
    // try {
    // User registeredUser = userService.registerUser(user);
    // return ResponseEntity.ok(registeredUser);
    // } catch (Exception e) {
    // return ResponseEntity.badRequest().body(e.getMessage());
    // }
    // }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        log.info("Raw request: {}", registerRequest);
        return ResponseEntity.ok(userService.registerUser(registerRequest));
    }
    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody User user) {
    // try {
    // User registeredUser = userService.login(user);
    // return ResponseEntity.ok(registeredUser);
    // } catch (Exception e) {
    // return ResponseEntity.badRequest().body(e.getMessage());
    // }
    // }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody UserDetails user) {
    // try {
    // User authenticatedUser = userService.login(user);
    // String token = jwtUtil.generateToken(user.getUsername());

    // // ✅ Return a response matching the expected structure
    // Map<String, Object> response = new HashMap<>();
    // response.put("token", token); // Replace with real JWT later
    // response.put("user", Map.of(
    // "id", authenticatedUser.getId(),
    // "email", authenticatedUser.getEmail(),
    // "username", authenticatedUser.getUsername()));

    // return ResponseEntity.ok(response);
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    // }
    // }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // try {
    // UserDetails userDetails =
    // userDetailsService.loadUserByUsername(loginRequest.getUsername());

    // // Debug output - only for development/testing!
    // System.out.println("Raw password from request: " +
    // loginRequest.getPassword());
    // System.out.println("Encoded password from DB: " + userDetails.getPassword());

    // if (!passwordEncoder.matches(loginRequest.getPassword(),
    // userDetails.getPassword())) {
    // throw new BadCredentialsException("Invalid username or password");
    // }

    // // Authenticate the user manually (or use AuthenticationManager)
    // if (!passwordEncoder.matches(loginRequest.getPassword(),
    // userDetails.getPassword())) {
    // throw new BadCredentialsException("Invalid username or password");
    // }

    // User authenticatedUser =
    // userService.getUserByUsername(loginRequest.getUsername());

    // String token = jwtUtil.generateToken(userDetails);

    // Map<String, Object> response = new HashMap<>();
    // response.put("token", token);
    // response.put("user", Map.of(
    // "id", authenticatedUser.getId(),
    // "email", authenticatedUser.getEmail(),
    // "username", authenticatedUser.getUsername()));

    // return ResponseEntity.ok(response);

    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error",
    // e.getMessage()));
    // }
    // }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // try {
    // // Load user by email, not username
    // User userEntity = userService.getUserByEmail(loginRequest.getEmail());

    // if (userEntity == null) {
    // throw new UsernameNotFoundException("User not found with email: " +
    // loginRequest.getEmail());
    // }

    // // Match raw password with hashed password
    // if (!passwordEncoder.matches(loginRequest.getPassword(),
    // userEntity.getPassword())) {
    // throw new BadCredentialsException("Invalid email or password");
    // }

    // // Load UserDetails via your custom service, if needed for JWT
    // UserDetails userDetails =
    // userDetailsService.loadUserByUsername(userEntity.getUsername());

    // String token = jwtUtil.generateToken(userDetails);

    // Map<String, Object> response = new HashMap<>();
    // response.put("token", token);
    // response.put("user", Map.of(
    // "id", userEntity.getId(),
    // "email", userEntity.getEmail(),
    // "username", userEntity.getUsername()));

    // return ResponseEntity.ok(response);

    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error",
    // e.getMessage()));
    // }
    // }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = userService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.getUserByUsername(userDetails.getUsername());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}