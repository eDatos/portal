package com.stat4you.core.email;

import java.io.InputStream;
import java.util.Arrays;

import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.util.StringUtils;

public class MockJavaMailSender implements JavaMailSender {

    private static final Logger logger = LoggerFactory.getLogger(MockJavaMailSender.class);

    @Override
    public void send(SimpleMailMessage simpleMessage) throws MailException {
        String to = StringUtils.collectionToDelimitedString(Arrays.asList(simpleMessage.getTo()), ",", "[", "]");
        logger.info("send SimpleMail[from:" + simpleMessage.getFrom() + " +, to: " + to + ", text: " + simpleMessage.getText() + "]");
    }

    @Override
    public void send(SimpleMailMessage[] simpleMessages) throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public MimeMessage createMimeMessage() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MimeMessage createMimeMessage(InputStream contentStream) throws MailException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void send(MimeMessage mimeMessage) throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public void send(MimeMessage[] mimeMessages) throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {
        // TODO Auto-generated method stub

    }

    @Override
    public void send(MimeMessagePreparator[] mimeMessagePreparators) throws MailException {
        // TODO Auto-generated method stub

    }

}
