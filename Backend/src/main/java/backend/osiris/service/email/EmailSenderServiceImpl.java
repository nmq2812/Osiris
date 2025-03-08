package backend.osiris.service.email;

import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Map;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private final Configuration freemakerConfiguration;
    private final JavaMailSender javaMailSender;

    public EmailSenderServiceImpl(Configuration freemakerConfiguration, JavaMailSender javaMailSender) {
        this.freemakerConfiguration = freemakerConfiguration;
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendVerificationToken(String toEmail, Map<String, Object> attributes) {
        String text = getEmailContent("verify-email.ftlh", attributes);
        sendEmail(toEmail, "[Osiris Shop] Xác thực email", text);
    }

    @Override
    public void sendForgetPasswordToken(String toEmail, Map<String, Object> attributes) {
        String text = getEmailContent("forget-password-email.ftlh", attributes);
        sendEmail(toEmail, "[Osiris Shop] Yêu cầu cấp lại mật khẩu", text);
    }

    private String getEmailContent(String template, Map<String, Object> model) {
        try {
            StringWriter stringWriter = new StringWriter();
            freemakerConfiguration.getTemplate(template).process(model, stringWriter);
            return stringWriter.getBuffer().toString();
        } catch (TemplateException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}