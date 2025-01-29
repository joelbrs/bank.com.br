package br.com.joelf.mstransaction.infrastructure.async.rabbitmq;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;

import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;

public class RabbitMessagePublisher implements MessagePublisher {
    
    private final RabbitTemplate rabbitTemplate;
    private final Queue queue;

    public RabbitMessagePublisher(
        RabbitTemplate rabbitTemplate,
        Queue queue
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.queue = queue;
    }

    @Override
    public void handleMessage(String message) throws JsonProcessingException, AmqpException {
        rabbitTemplate.convertAndSend(queue.getName(), message);
    }
}
