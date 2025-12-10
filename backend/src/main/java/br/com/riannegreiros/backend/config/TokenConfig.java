package br.com.riannegreiros.backend.config;

import java.time.Instant;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import br.com.riannegreiros.backend.users.User;

@Component
public class TokenConfig {

    private static final Logger log = LoggerFactory.getLogger(TokenConfig.class);

    private final String secretKey = "my_very_secure_secret_key_that_is_long_enough_for_hmac256"; // TODO: Use
                                                                                                  // environment
                                                                                                  // variable in
                                                                                                  // production

    public String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        return JWT.create()
                .withClaim("userId", user.getId())
                .withSubject(user.getEmail())
                .withExpiresAt(Instant.now().plusSeconds(86400))
                .withIssuedAt(Instant.now())
                .sign(algorithm);
    }

    public String extractUsername(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException e) {
            log.debug("Failed to extract username from token", e);
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            log.debug("Token validation failed", e);
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
            return decodedJWT.getExpiresAt().before(java.util.Date.from(Instant.now()));
        } catch (JWTVerificationException e) {
            return true;
        }
    }

    public Optional<JWTUserData> validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .build().verify(token);

            return Optional.of(JWTUserData.builder()
                    .userId(decodedJWT.getClaim("userId").asLong())
                    .email(decodedJWT.getSubject())
                    .build());
        } catch (JWTVerificationException e) {
            log.debug("JWT verification failed for token: {}", token, e);
            return Optional.empty();
        }
    }
}
