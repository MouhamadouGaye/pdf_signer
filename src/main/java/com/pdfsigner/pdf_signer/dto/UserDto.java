package com.pdfsigner.pdf_signer.dto;

import java.util.Set;

import com.pdfsigner.pdf_signer.model.Role;

import lombok.Data;
import lombok.RequiredArgsConstructor;

// @Data
// @RequiredArgsConstructor
// public class UserDto {
//     private Long id;
//     private String email;
//     private String username;

//     public UserDto(Long id, String email, String username) {
//         this.id = id;
//         this.email = email;
//         this.username = username;
//     }
// }
@Data
public class UserDto {
    private Long id;
    private String email;
    private String username;
    private Set<String> roles;

    public UserDto(Long id, String email, String username, Set<String> roles) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles;
    }

    // getters & setters
}
