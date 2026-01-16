package br.com.riannegreiros.backend.users.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.config.TokenConfig;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.VerificationCode;
import br.com.riannegreiros.backend.users.dto.request.EmailVerificationRequest;
import br.com.riannegreiros.backend.users.dto.response.EmailVerificationResponse;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import br.com.riannegreiros.backend.users.repository.VerificationCodeRepository;
import br.com.riannegreiros.backend.util.exceptions.UserNotFoundException;
import br.com.riannegreiros.backend.util.exceptions.VerificationCodeNotFoundException;
import br.com.riannegreiros.backend.util.exceptions.VerificationException;
import jakarta.transaction.Transactional;

@Service
public class EmailVerificationService {
    private static final Logger log = LoggerFactory.getLogger(EmailVerificationService.class);

    private final UserRepository userRepository;
    private final TokenConfig tokenConfig;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

    public EmailVerificationService(UserRepository userRepository,
            TokenConfig tokenConfig, VerificationCodeRepository verificationCodeRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenConfig = tokenConfig;
        this.verificationCodeRepository = verificationCodeRepository;
        this.emailService = emailService;
    }

    @Transactional
    public EmailVerificationResponse verifyEmail(EmailVerificationRequest request) {
        Optional<VerificationCode> vOptional = verificationCodeRepository.findByEmailAndCode(request.email(),
                request.code());

        if (!vOptional.isPresent() || vOptional.get().isExpired()) {
            throw new VerificationException("Invalid or expired verification code");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setVerified(true);
        userRepository.save(user);
        verificationCodeRepository.deleteByEmail(request.email());

        String token = tokenConfig.generateToken(user);

        return new EmailVerificationResponse(
                token,
                user.getLastName(),
                user.getFirstName(),
                user.getEmail());
    }

    @Transactional
    public String resendVerificationCode(String email) {
        Optional<VerificationCode> vOptional = verificationCodeRepository.findByEmail(email);

        log.info("Resend verification code requested for email: {}", email);

        if (!vOptional.isPresent()) {
            throw new VerificationCodeNotFoundException("Verification code do not exist for this email: " + email);
        }

        verificationCodeRepository.deleteByEmail(email);
        VerificationCode code = new VerificationCode(email);
        verificationCodeRepository.save(code);
        emailService.sendVerificationEmail(email, code.getCode());

        return "Verification code resent to " + email;
    }
}
