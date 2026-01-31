package br.com.riannegreiros.backend.email.services;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.util.exceptions.EmailSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Email Verification");
            helper.setText(buildVerificationCodeEmailContent(verificationCode), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send email", e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Reset Your Password");
            helper.setText(buildPasswordResetEmailContent(resetCode), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send password reset email", e);
        }
    }

    private String buildPasswordResetEmailContent(String resetCode) {
        return "<html><body>" +
                "<h2>Reset Your Password</h2>" +
                "<p>Your password reset code is:</p>" +
                "<h1 style='font-size: 32px; letter-spacing: 5px; color: #007bff;'>" + resetCode + "</h1>" +
                "<p>Enter this code on the password reset page to continue.</p>" +
                "<p style='color: #666; font-size: 12px;'>This code will expire in 15 minutes.</p>" +
                "<p>If you didn't request this, ignore this email.</p>" +
                "</body></html>";
    }

    private String buildVerificationCodeEmailContent(String code) {
        return "<html><body>" +
                "<h2>Email Verification</h2>" +
                "<p>Your verification code is:</p>" +
                "<h1>" + code + "</h1>" +
                "<p>This code will expire in 15 minutes.</p>" +
                "</body></html>";
    }
}
