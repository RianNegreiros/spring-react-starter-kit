package br.com.riannegreiros.backend.users.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.riannegreiros.backend.users.dto.request.ForgotPasswordRequest;
import br.com.riannegreiros.backend.users.dto.request.ResetPasswordRequest;
import br.com.riannegreiros.backend.users.dto.request.UserUpdateRequest;
import br.com.riannegreiros.backend.users.dto.request.ValidateResetCodeRequest;
import br.com.riannegreiros.backend.users.dto.response.PasswordResetResponse;
import br.com.riannegreiros.backend.users.dto.response.UserResponse;
import br.com.riannegreiros.backend.users.service.PasswordResetService;
import br.com.riannegreiros.backend.users.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    public UserController(UserService userService, PasswordResetService passwordResetService) {
        this.userService = userService;
        this.passwordResetService = passwordResetService;
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<PasswordResetResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Password reset request for email={}", request.email());
        passwordResetService.requestPasswordReset(request.email());
        return ResponseEntity.ok(new PasswordResetResponse(
                "If an account exists with this email, you will receive a password reset code"));
    }

    @PostMapping("/password/validate-code")
    public ResponseEntity<PasswordResetResponse> validateResetCode(
            @Valid @RequestBody ValidateResetCodeRequest request) {
        log.info("Validating password reset code");
        passwordResetService.validateCode(request.code());
        return ResponseEntity.ok(new PasswordResetResponse("Code is valid"));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<PasswordResetResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Password reset request");
        passwordResetService.resetPassword(request.code(), request.newPassword());
        return ResponseEntity.ok(new PasswordResetResponse("Password reset successfully"));
    }
}
