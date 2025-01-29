package br.com.joelf.mstransaction.infrastructure.async.rabbitmq.listeners;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

public class RabbitTransactionMessageListener implements MessageListener {

    @Override
    public void onMessage(Message message) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
