package br.com.riannegreiros.backend.users.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.config.TokenConfig;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.VerificationCode;
import br.com.riannegreiros.backend.users.dto.request.EmailVerificationRequest;
import br.com.riannegreiros.backend.users.dto.response.EmailVerificationResponse;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import br.com.riannegreiros.backend.users.repository.VerificationCodeRepository;
import jakarta.transaction.Transactional;

@Service
public class EmailVerificationService {
    private final UserRepository userRepository;
    private final TokenConfig tokenConfig;
    private final VerificationCodeRepository verificationCodeRepository;

    public EmailVerificationService(UserRepository userRepository,
            TokenConfig tokenConfig, VerificationCodeRepository verificationCodeRepository) {
        this.userRepository = userRepository;
        this.tokenConfig = tokenConfig;
        this.verificationCodeRepository = verificationCodeRepository;
    }

    @Transactional
    public EmailVerificationResponse VerifyEmail(EmailVerificationRequest request) {
        Optional<VerificationCode> vOptional = verificationCodeRepository.findByEmailAndCode(request.email(),
                request.code());

        if (!vOptional.isPresent() || vOptional.get().isExpired()) {
            throw new RuntimeException("Invalid or expired verification code");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

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
}
