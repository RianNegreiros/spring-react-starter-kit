package br.com.riannegreiros.backend.users.controller;

import org.springframework.web.bind.annotation.RestController;

import br.com.riannegreiros.backend.users.dto.request.LoginRequest;
import br.com.riannegreiros.backend.users.dto.request.UserRegisterRequest;
import br.com.riannegreiros.backend.users.dto.response.LoginResponse;
import br.com.riannegreiros.backend.users.dto.response.UserRegisterResponse;
import br.com.riannegreiros.backend.users.service.AuthService;
import br.com.riannegreiros.backend.users.service.UserService;
import br.com.riannegreiros.backend.util.exceptions.AuthenticationException;
import br.com.riannegreiros.backend.util.exceptions.EmailAlreadyExistsException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final AuthService authService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User oauthUser) {
        if (oauthUser != null) {
            return ResponseEntity.ok(oauthUser.getAttributes());
        }
        return userService.getCurrentUser()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest, HttpServletResponse response) {
        log.info("Login request received for email: {}", request.email());

        try {
            httpRequest.getSession().invalidate();
        } catch (Exception e) {
            throw new AuthenticationException("Failed to invalidate session");
        }
        SecurityContextHolder.clearContext();

        try {
            LoginResponse loginResponse = authService.authenticate(request);

            Cookie cookie = new Cookie("auth_token", loginResponse.token());
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setMaxAge(86400);
            cookie.setPath("/");
            response.addCookie(cookie);

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            throw new AuthenticationException("Invalid credentials or authentication failed");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> register(
            @Valid @RequestBody UserRegisterRequest request) {

        log.info("Register attempt for email={}", request.email());

        try {
            UserRegisterResponse response = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (EmailAlreadyExistsException e) {
            throw e;
        } catch (Exception e) {
            throw new AuthenticationException("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = new Cookie("auth_token", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        try {
            request.getSession().invalidate();
        } catch (Exception e) {
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }
}
