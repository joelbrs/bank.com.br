package br.com.joelf.wstransaction.infraestructure.entrypoint.rabbitmq;

import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.domain.usecases.ProcessTransactionUseCase;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;

@AllArgsConstructor
public class TransactionSubscriber {

    private final ProcessTransactionUseCase processTransactionUseCase;

    @RabbitListener(queues = "${amqp.queues.transaction.name}")
    public void processTransaction(@Payload String payload) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        Transaction transaction = mapper.readValue(payload, Transaction.class);

        processTransactionUseCase.execute(transaction);
    }
}
