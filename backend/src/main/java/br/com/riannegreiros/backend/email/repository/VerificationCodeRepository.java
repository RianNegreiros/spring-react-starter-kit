package br.com.riannegreiros.backend.email.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.riannegreiros.backend.email.VerificationCode;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByEmailAndCode(String email, String code);

    Optional<VerificationCode> findByEmail(String email);

    void deleteByEmail(String email);
}
