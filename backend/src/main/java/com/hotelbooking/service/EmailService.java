package com.hotelbooking.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        if (!mailEnabled || mailUsername == null || mailUsername.isBlank()) {
            log.info("Welcome email skipped (mail not configured) for {}", toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to StayEase — Your account is ready!");
            helper.setText(buildWelcomeHtml(name), true);

            mailSender.send(message);
            log.info("Welcome email sent to {}", toEmail);
        } catch (MessagingException ex) {
            log.error("Failed to send welcome email to {}: {}", toEmail, ex.getMessage());
        } catch (Exception ex) {
            log.error("Unexpected error sending welcome email to {}: {}", toEmail, ex.getMessage());
        }
    }

    private String buildWelcomeHtml(String name) {
        String displayName = name != null && !name.isBlank() ? name : "there";

        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
                          <tr>
                            <td style="background:linear-gradient(135deg,#1e3a8a,#1a56db);padding:32px;text-align:center;">
                              <h1 style="margin:0;color:#ffffff;font-size:28px;">🏨 StayEase</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:32px;">
                              <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;">Welcome, %s!</h2>
                              <p style="margin:0 0 16px;color:#475569;font-size:16px;line-height:1.6;">
                                Thank you for joining StayEase. Your account has been created successfully.
                              </p>
                              <p style="margin:0 0 16px;color:#475569;font-size:16px;line-height:1.6;">
                                You can now browse hotels across India, check room availability, and book your perfect stay — all in one place.
                              </p>
                              <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                                <tr>
                                  <td style="background:#1a56db;border-radius:8px;">
                                    <a href="http://localhost:5173" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;">
                                      Start Exploring Hotels
                                    </a>
                                  </td>
                                </tr>
                              </table>
                              <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">
                                Happy travels!<br>
                                The StayEase Team
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(escapeHtml(displayName));
    }

    private String escapeHtml(String input) {
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
