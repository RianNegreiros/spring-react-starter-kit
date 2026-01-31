package br.com.riannegreiros.backend.users;

import br.com.riannegreiros.backend.entity.AbstractEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "password_reset_tokens")
public class PasswordResetToken extends AbstractEntity {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int EXPIRY_MINUTES = 15;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false, name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private boolean used = false;

    public PasswordResetToken(User user) {
        this.user = user;
        this.token = generateCode();
        this.expiryDate = LocalDateTime.now().plusMinutes(EXPIRY_MINUTES);
    }

    private String generateCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    public boolean isValid() {
        return !used && !isExpired();
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    public void markUsed() {
        this.used = true;
    }
}
