package com.bookfair.email_service.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    @Autowired
    private SendEmailService sendEmailService;

    @PostMapping("/send-email")
    public String sendEmail(@RequestParam String to, @RequestParam String subject, @RequestParam String body) {
        sendEmailService.SendEmailService(to, body, subject);
        return "Email sent successfully";
    }
    
}
