package br.com.riannegreiros.backend.email;

import java.time.LocalDateTime;
import java.util.Random;

import br.com.riannegreiros.backend.entity.AbstractEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "verification_codes")
@Getter
@Setter
@NoArgsConstructor
public class VerificationCode extends AbstractEntity {

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public VerificationCode(String email) {
        this.email = email;
        this.code = generateCode();
        this.expiresAt = LocalDateTime.now().plusMinutes(15);
    }

    private String generateCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void regenerate() {
        this.code = generateCode();
        this.expiresAt = LocalDateTime.now().plusMinutes(15);
    }
}
