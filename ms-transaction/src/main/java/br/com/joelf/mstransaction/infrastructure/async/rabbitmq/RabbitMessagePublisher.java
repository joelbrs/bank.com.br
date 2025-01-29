package br.com.joelf.mstransaction.infrastructure.async.rabbitmq;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.async.exceptions.UnprocessableEntityMessage;

public class RabbitMessagePublisher implements MessagePublisher {
    
    private final RabbitTemplate rabbitTemplate;
    private final Queue queue;
    private final Integer maxRetries;

    public RabbitMessagePublisher(
        RabbitTemplate rabbitTemplate,
        Queue queue,
        Integer maxRetries
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.queue = queue;
        this.maxRetries = maxRetries;
    }

    @Override
    public void handleMessage(String message) {
        try {
            rabbitTemplate.convertAndSend(queue.getName(), message);
        } catch (AmqpException e) {
            retry(0, message);
        }
    }

    private void retry(int retry, String message) {
        if (retry >= maxRetries) {
            throw new UnprocessableEntityMessage(message);
        }

        try {
            rabbitTemplate.convertAndSend(queue.getName(), message);
        } catch (AmqpException e) {
            retry(retry + 1, message);
        }
    }
}
