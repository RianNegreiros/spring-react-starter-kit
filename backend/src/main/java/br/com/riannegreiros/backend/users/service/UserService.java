package br.com.riannegreiros.backend.users.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.config.JWTUserData;
import br.com.riannegreiros.backend.config.TokenConfig;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.dto.request.UserRegisterRequest;
import br.com.riannegreiros.backend.users.dto.response.UserRegisterResponse;
import br.com.riannegreiros.backend.users.dto.response.UserResponse;
import br.com.riannegreiros.backend.users.repository.UserRepository;
import br.com.riannegreiros.backend.util.exceptions.EmailAlreadyExistsException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenConfig tokenConfig;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenConfig tokenConfig) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenConfig = tokenConfig;
    }

    public UserRegisterResponse registerUser(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User newUser = new User();
        newUser.setEmail(request.email());
        newUser.setName(request.name());
        newUser.setPassword(passwordEncoder.encode(request.password()));

        User savedUser = userRepository.save(newUser);
        String token = tokenConfig.generateToken(savedUser);

        return new UserRegisterResponse(
                token,
                savedUser.getName(),
                savedUser.getEmail());
    }

    public Optional<UserResponse> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof JWTUserData userData) {
            return Optional.of(new UserResponse(
                    userData.userId(),
                    userData.email(),
                    userData.name()));
        }

        if (principal instanceof User user) {
            return Optional.of(new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getName()));
        }

        return Optional.empty();
    }
}
