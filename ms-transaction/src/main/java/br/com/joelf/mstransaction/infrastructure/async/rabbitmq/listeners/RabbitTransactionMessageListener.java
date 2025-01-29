package br.com.joelf.mstransaction.infrastructure.async.rabbitmq.listeners;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.services.TransactionService;

public class RabbitTransactionMessageListener implements MessageListener {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final TransactionService transactionService;

    public RabbitTransactionMessageListener(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @Override
    public void onMessage(Message message) {
        transactionService.proccess(MAPPER.convertValue(message.getBody(), Transaction.class));
    }
}
