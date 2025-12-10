package br.com.riannegreiros.backend.users.service;

import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.users.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user by username={}", username);
        return userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    log.warn("User not found with username={}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });
    }
}
