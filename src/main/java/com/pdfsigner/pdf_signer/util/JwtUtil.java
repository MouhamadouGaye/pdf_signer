// package com.pdfsigner.pdf_signer.util;

// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Component;

// import java.security.Key;
// import java.util.Date;
// import java.util.List;
// import java.util.stream.Collectors;

// @Component
// public class JwtUtil {

//     private final String SECRET_KEY;
//     private final long EXPIRATION_TIME; // = 1000 * 60 * 60 * 10; // 10 hours

//     public JwtUtil(
//             @Value("${jwt.secret}") String secretKey,
//             @Value("${jwt.expiration}") long expirationTime) {
//         this.EXPIRATION_TIME = expirationTime;
//         this.SECRET_KEY = secretKey;
//     }

//     private Key getSigningKey() {
//         return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//     }

//     public String generateToken(UserDetails userDetails) {
//         Claims claims = Jwts.claims();
//         claims.put("roles", userDetails.getAuthorities().stream()
//                 .map(GrantedAuthority::getAuthority)
//                 .collect(Collectors.toList()));

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(userDetails.getUsername())
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     public String extractUsername(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject();
//     }

//     public boolean validateToken(String token, String expectedUsername) {
//         final String username = extractUsername(token);
//         return (username.equals(expectedUsername) && !isTokenExpired(token));
//     }

//     private boolean isTokenExpired(String token) {
//         Date expiration = Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getExpiration();
//         return expiration.before(new Date());
//     }

//     // public Boolean validateToken(String token, UserDetails userDetails) {
//     // final String username = extractUsername(token);
//     // return (username.equals(userDetails.getUsername()));
//     // }

//     public Boolean validateToken(String token, UserDetails userDetails) {
//         final String username = extractUsername(token);
//         return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//     }

//     public List<String> extractRoles(String token) {
//         Claims claims = Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();

//         return (List<String>) claims.get("roles");
//     }

// }

package com.pdfsigner.pdf_signer.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

// @Component
// public class JwtUtil {

//     private final String SECRET_KEY;
//     private final long EXPIRATION_TIME;

//     public JwtUtil(
//             @Value("${jwt.secret}") String secretKey,
//             @Value("${jwt.expiration}") long expirationTime) {
//         this.EXPIRATION_TIME = expirationTime;
//         this.SECRET_KEY = secretKey;

//         if (SECRET_KEY.length() < 32) {
//             throw new IllegalArgumentException("JWT secret key must be at least 32 characters long.");
//         }
//     }

//     private Key getSigningKey() {
//         return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

//     }

//     public String generateToken(UserDetails userDetails) {
//         Claims claims = Jwts.claims();
//         claims.put("roles", userDetails.getAuthorities().stream()
//                 .map(GrantedAuthority::getAuthority)
//                 .collect(Collectors.toList()));

//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(userDetails.getUsername()) // email used as subject
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     public String extractUsername(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject();
//     }

//     public boolean validateToken(String token, UserDetails userDetails) {
//         final String username = extractUsername(token);
//         return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
//     }

//     private boolean isTokenExpired(String token) {
//         Date expiration = Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getExpiration();
//         return expiration.before(new Date());
//     }

//     public List<String> extractRoles(String token) {
//         Claims claims = Jwts.parserBuilder()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();

//         List<?> roles = claims.get("roles", List.class);
//         return roles.stream().map(role -> (String) role).collect(Collectors.toList());
//     }
// }
@Component
public class JwtUtil {

    private final String SECRET_KEY;
    private final long EXPIRATION_TIME;
    private final Key SIGNING_KEY;

    public JwtUtil(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration}") long expirationTime) {
        this.EXPIRATION_TIME = expirationTime;
        this.SECRET_KEY = secretKey;

        if (SECRET_KEY == null || SECRET_KEY.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 characters long.");
        }

        // Pre-calculate the signing key
        this.SIGNING_KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    private Key getSigningKey() {
        return SIGNING_KEY;
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = getClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    public List<String> extractRoles(String token) {
        Claims claims = getClaimsFromToken(token);
        List<?> roles = claims.get("roles", List.class);
        return roles.stream()
                .map(Object::toString)
                .collect(Collectors.toList());
    }

    private Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            // Log expiration separately if needed
            throw e;
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException e) {
            throw new JwtException("Invalid JWT token", e);
        } catch (IllegalArgumentException e) {
            throw new JwtException("JWT token compact of handler are invalid", e);
        }
    }
}
