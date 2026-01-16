package br.com.riannegreiros.backend.users.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.config.TokenConfig;
import br.com.riannegreiros.backend.users.User;
import br.com.riannegreiros.backend.users.dto.request.LoginRequest;
import br.com.riannegreiros.backend.users.dto.response.LoginResponse;
import br.com.riannegreiros.backend.util.exceptions.UserNotVerifiedException;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final TokenConfig tokenConfig;

    public AuthService(AuthenticationManager authenticationManager, TokenConfig tokenConfig) {
        this.authenticationManager = authenticationManager;
        this.tokenConfig = tokenConfig;
    }

    public LoginResponse authenticate(LoginRequest request) {
        String email = request.email();
        log.info("Authentication attempt for email: {}", email);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email,
                request.password());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        User user = (User) authentication.getPrincipal();
        if (!user.isVerified()) {
            log.warn("Authentication failed for email: {} - User not verified", email);
            throw new UserNotVerifiedException("User not verified");
        }

        String token = tokenConfig.generateToken(user);

        log.info("Authentication successful for email: {}", email);
        return new LoginResponse(token);
    }
}
