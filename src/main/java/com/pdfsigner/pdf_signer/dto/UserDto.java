package com.pdfsigner.pdf_signer.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String username;

    public UserDto(Long id, String email, String username) {
        this.id = id;
        this.email = email;
        this.username = username;
    }
}
