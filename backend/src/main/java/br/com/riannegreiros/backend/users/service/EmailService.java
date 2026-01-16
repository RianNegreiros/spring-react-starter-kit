package br.com.riannegreiros.backend.users.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import br.com.riannegreiros.backend.util.exceptions.EmailSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Email Verification Code");
            helper.setText(buildEmailContent(verificationCode), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send email", e);
        }
    }

    private String buildEmailContent(String code) {
        return "<html><body>" +
                "<h2>Email Verification</h2>" +
                "<p>Your verification code is:</p>" +
                "<h1>" + code + "</h1>" +
                "<p>This code will expire in 15 minutes.</p>" +
                "</body></html>";
    }
}
