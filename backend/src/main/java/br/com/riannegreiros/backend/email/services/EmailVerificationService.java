package br.com.riannegreiros.backend.email.services;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.config.TokenConfig;
import br.com.riannegreiros.backend.email.VerificationCode;
import br.com.riannegreiros.backend.email.repository.VerificationCodeRepository;
import br.com.riannegreiros.backend.email.request.EmailVerificationRequest;
import br.com.riannegreiros.backend.email.request.ResendVerificationCodeRequest;
import br.com.riannegreiros.backend.email.response.EmailVerificationResponse;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.repository.UserRepository;
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
    public String resendVerificationCode(ResendVerificationCodeRequest request) {
        log.info("Resend verification code requested for email: {}", request.email());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.email()));

        if (user.isVerified()) {
            throw new VerificationException("Email already verified");
        }

        Optional<VerificationCode> vOptional = verificationCodeRepository.findByEmail(request.email());

        if (!vOptional.isPresent()) {
            throw new VerificationCodeNotFoundException("No verification code found for email: " + request.email());
        }

        VerificationCode code = vOptional.get();
        code.regenerate();

        emailService.sendVerificationEmail(request.email(), code.getCode());

        return "Verification code resent to " + request.email();
    }
}
