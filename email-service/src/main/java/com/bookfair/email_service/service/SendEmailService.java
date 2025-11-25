package com.bookfair.email_service.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class SendEmailService {

    @Autowired
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmailId;
    
    public void SendEmailService(String recipient, String body, String subject) {
        SimpleMainMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromEmailId);
        simpleMailMessage.setTo(recipient);
        simpleMailMessage.setText(body);
        simpleMailMessage.setSubject(subject);

        
        javaMailSender.send(simpleMailMessage);
    }

}
