package br.com.riannegreiros.backend.users.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.config.JWTUserData;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.VerificationCode;
import br.com.riannegreiros.backend.users.dto.request.UserRegisterRequest;
import br.com.riannegreiros.backend.users.dto.request.UserUpdateRequest;
import br.com.riannegreiros.backend.users.dto.response.UserRegisterResponse;
import br.com.riannegreiros.backend.users.dto.response.UserResponse;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import br.com.riannegreiros.backend.users.repository.VerificationCodeRepository;
import br.com.riannegreiros.backend.util.exceptions.AuthenticationException;
import br.com.riannegreiros.backend.util.exceptions.EmailAlreadyExistsException;
import br.com.riannegreiros.backend.util.exceptions.UserNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final VerificationCodeRepository verificationCodeRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            EmailService emailService, VerificationCodeRepository verificationCodeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificationCodeRepository = verificationCodeRepository;
    }

    public UserRegisterResponse registerUser(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setFirstName(request.firstName());
        newUser.setLastName(request.lastName());
        newUser.setPassword(passwordEncoder.encode(request.password()));

        User savedUser = userRepository.save(newUser);

        VerificationCode code = new VerificationCode(request.email());
        verificationCodeRepository.save(code);
        emailService.sendVerificationEmail(request.email(), code.getCode());

        return new UserRegisterResponse(
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                "Verification code sent to " + request.email());
    }

    public Optional<UserResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof JWTUserData userData) {
            User user = userRepository.findById(userData.userId()).orElse(null);
            if (user != null) {
                return Optional.of(new UserResponse(
                        userData.userId().toString(),
                        userData.email(),
                        userData.firstName(),
                        userData.lastName(),
                        user.getAvatarUrl()));
            }
        }

        if (principal instanceof User user) {
            return Optional.of(new UserResponse(
                    user.getId().toString(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAvatarUrl()));
        }

        return Optional.empty();
    }

    public UserResponse updateUser(UserUpdateRequest request) {
        User user = getCurrentUserEntity();

        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId().toString(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getAvatarUrl());
    }

    public User getCurrentUserEntity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new AuthenticationException("User not authenticated");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof JWTUserData userData) {
            return userRepository.findById(userData.userId())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
        }

        if (principal instanceof User user) {
            return user;
        }

        throw new AuthenticationException("Invalid authentication principal");
    }
}
