// package com.pdfsigner.pdf_signer.service;

// import com.pdfsigner.pdf_signer.model.User;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import com.pdfsigner.pdf_signer.repository.UserRepository;

// @Service
// public class MyUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepository;

//     public MyUserDetailsService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         // Replace with your actual user fetching logic
//         User user = userRepository.findByUsername(username)
//                 .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//         return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
//                 new java.util.ArrayList<>());
//     }
// }

package com.pdfsigner.pdf_signer.service;

import com.pdfsigner.pdf_signer.model.User;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pdfsigner.pdf_signer.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// @Service
// @Transactional
// public class MyUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepository;

//     public MyUserDetailsService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//         User user = userRepository.findByEmail(email)
//                 .orElseThrow(() -> new UsernameNotFoundException("User not found"));

//         // This avoids the N+1 query problem
//         user.getRoles().size(); // Force load roles

//         return new org.springframework.security.core.userdetails.User(
//                 user.getEmail(),
//                 user.getPassword(),
//                 user.getAuthorities());
//     }
// }

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmailWithRoles(email) // Custom query
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Convert roles to GrantedAuthority
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities);
    }
}
