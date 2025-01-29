package br.com.joelf.mstransaction.infrastructure.async;

import org.springframework.amqp.AmqpException;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface MessagePublisher {
    void handleMessage(String message) throws JsonProcessingException, AmqpException;
}
