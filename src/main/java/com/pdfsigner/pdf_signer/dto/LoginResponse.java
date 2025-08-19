package com.pdfsigner.pdf_signer.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDto user;

    public LoginResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    // getters & setters
}
