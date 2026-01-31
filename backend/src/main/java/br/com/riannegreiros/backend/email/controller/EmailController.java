package br.com.riannegreiros.backend.email.controller;

import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.com.riannegreiros.backend.email.request.EmailVerificationRequest;
import br.com.riannegreiros.backend.email.request.ResendVerificationCodeRequest;
import br.com.riannegreiros.backend.email.response.EmailVerificationResponse;
import br.com.riannegreiros.backend.email.services.EmailVerificationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private static final Logger log = LoggerFactory.getLogger(EmailController.class);

    private final EmailVerificationService emailVerificationService;

    public EmailController(EmailVerificationService emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/verify-email")
    public ResponseEntity<EmailVerificationResponse> verifyEmail(
            @Valid @RequestBody EmailVerificationRequest request,
            HttpServletResponse response) {
        log.info("Email verification attempt for email={}", request.email());
        EmailVerificationResponse emailVerificationResponse = emailVerificationService.verifyEmail(request);

        Cookie cookie = new Cookie("auth_token", emailVerificationResponse.token());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setMaxAge(86400);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(emailVerificationResponse);
    }

    @PostMapping("/resend-verification-code")
    public ResponseEntity<String> resendVerificationCode(
            @Valid @RequestBody ResendVerificationCodeRequest request) {
        log.info("Resend verification code attempt for email={}", request.email());
        String emailVerificationResponse = emailVerificationService.resendVerificationCode(request);
        return ResponseEntity.ok(emailVerificationResponse);
    }
}
