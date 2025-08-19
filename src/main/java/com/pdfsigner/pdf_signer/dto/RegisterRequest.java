package com.pdfsigner.pdf_signer.dto;

import java.util.Set;

import javax.management.relation.Role;

public class RegisterRequest {
    private String username;

    // @NotBlank @Email
    private String email;

    // @NotBlank @Size(min = 8)
    private String password;

    // Must have default constructor
    public RegisterRequest() {
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}