package br.com.riannegreiros.backend.users.controller;

import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.com.riannegreiros.backend.users.dto.request.LoginRequest;
import br.com.riannegreiros.backend.users.dto.request.UserRegisterRequest;
import br.com.riannegreiros.backend.users.dto.request.UserUpdateRequest;
import br.com.riannegreiros.backend.util.ApiResponse;
import br.com.riannegreiros.backend.users.dto.response.LoginResponse;
import br.com.riannegreiros.backend.users.dto.response.UserRegisterResponse;
import br.com.riannegreiros.backend.users.dto.response.UserResponse;
import br.com.riannegreiros.backend.users.service.AuthService;
import br.com.riannegreiros.backend.users.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final AuthService authService;

    public UserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User oauthUser) {
        if (oauthUser != null) {
            return ResponseEntity.ok(ApiResponse.success(oauthUser.getAttributes(), "OAuth user data"));
        }

        return userService.getCurrentUser()
                .map(user -> ResponseEntity.ok(ApiResponse.success((Object) user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated")));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.info("Login request received for email: {}", request.email());

        LoginResponse loginResponse = authService.authenticate(request);

        Cookie cookie = new Cookie("auth_token", loginResponse.token());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(86400);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success(loginResponse, "Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserRegisterResponse>> register(
            @Valid @RequestBody UserRegisterRequest request) {

        log.info("Register attempt for email={}", request.email());

        try {
            UserRegisterResponse response = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(response, "User registered successfully"));

        } catch (Exception e) {
            throw e;
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody UserUpdateRequest request) {
        
        UserResponse response = userService.updateUser(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile updated successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        Cookie authCookie = new Cookie("auth_token", "");
        authCookie.setMaxAge(0);
        authCookie.setPath("/");
        authCookie.setHttpOnly(true);
        response.addCookie(authCookie);

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}
