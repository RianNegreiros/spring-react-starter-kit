package br.com.riannegreiros.backend.users.repository;

import br.com.riannegreiros.backend.users.PasswordResetToken;
import br.com.riannegreiros.backend.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(User user);
}
