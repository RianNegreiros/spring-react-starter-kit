package br.com.riannegreiros.backend.users.service;

import br.com.riannegreiros.backend.email.services.EmailService;
import br.com.riannegreiros.backend.users.PasswordResetToken;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.repository.PasswordResetTokenRepository;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import br.com.riannegreiros.backend.util.exceptions.PasswordResetTokenExpiredException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PasswordResetService {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(UserRepository userRepository, PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            log.warn("Password reset requested for non-existent email: {}", email);
            return;
        }

        PasswordResetToken existing = tokenRepository.findByUser(user);
        if (existing != null) {
            tokenRepository.delete(existing);
        }

        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
            log.info("Password reset code sent for user: {}", user.getId());
        } catch (Exception e) {
            log.error("Failed to send password reset email for user: {}", user.getId(), e);
            tokenRepository.delete(token);
            throw e;
        }
    }

    public void validateCode(String code) {
        PasswordResetToken resetToken = tokenRepository.findByToken(code);

        if (resetToken == null || !resetToken.isValid()) {
            throw new PasswordResetTokenExpiredException(
                    "Invalid or expired password reset code");
        }
    }

    public void resetPassword(String code, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(code);

        if (resetToken == null || !resetToken.isValid()) {
            throw new PasswordResetTokenExpiredException(
                    "Invalid or expired password reset code");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.markUsed();
        tokenRepository.save(resetToken);

        log.info("Password reset successful for user: {}", user.getId());
    }
}
