package br.com.riannegreiros.backend.users.controller;

import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.com.riannegreiros.backend.config.TokenConfig;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.dto.request.LoginRequest;
import br.com.riannegreiros.backend.users.dto.request.UserRegisterRequest;
import br.com.riannegreiros.backend.util.ErrorResponse;
import br.com.riannegreiros.backend.users.dto.response.LoginResponse;
import br.com.riannegreiros.backend.users.dto.response.UserRegisterResponse;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenConfig tokenConfig;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, TokenConfig tokenConfig) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenConfig = tokenConfig;
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal OAuth2User user) {
        return user.getAttributes();
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest request) {
        String email = request.email();
        log.info("Login attempt initiated for email: {}", email);

        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    email, request.password());
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            User user = (User) authentication.getPrincipal();
            String token = tokenConfig.generateToken(user);

            log.info("Login successful for email: {}", email);
            return ResponseEntity.ok(new LoginResponse(token));

        } catch (BadCredentialsException e) {
            log.warn("Login failed - invalid credentials for email: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Unauthorized", "Invalid email or password"));

        } catch (UsernameNotFoundException e) {
            log.warn("Login failed - user not found for email: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Unauthorized", "Invalid email or password"));

        } catch (Exception e) {
            log.error("Unexpected error during login for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Internal Server Error", "Login failed. Please try again later"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody UserRegisterRequest request) {
        log.info("Register attempt for email={}", request.email());
        Optional<UserDetails> existingUser = userRepository.findByEmail(request.email());
        if (existingUser.isPresent()) {
            log.warn("Registration failed: email already registered={}", request.email());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email already registered"));
        }

        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setName(request.name());
        newUser.setPassword(passwordEncoder.encode(request.password()));

        try {
            userRepository.save(newUser);
            log.info("User registered successfully email={}", newUser.getEmail());
            String token = tokenConfig.generateToken(newUser);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new UserRegisterResponse(token, newUser.getName(), newUser.getEmail()));
        } catch (Exception e) {
            log.error("Failed to register user email={}", newUser.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Unable to register user", e.getMessage()));
        }
    }
}
