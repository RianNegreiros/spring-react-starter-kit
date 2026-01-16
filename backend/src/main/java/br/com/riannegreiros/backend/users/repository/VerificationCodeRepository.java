package br.com.riannegreiros.backend.users.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.riannegreiros.backend.users.VerificationCode;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByEmailAndCode(String email, String code);

    Optional<VerificationCode> findByEmail(String email);

    void deleteByEmail(String email);
}
