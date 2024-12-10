package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.exceptions.PublisherDataProviderException;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@AllArgsConstructor
public class PublisherDataProviderImpl implements PublisherDataProvider {

    private final Queue queue;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public void publishTransaction(Transaction transaction) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            rabbitTemplate.convertAndSend(queue.getName(), mapper.writeValueAsString(transaction));
        } catch (JsonProcessingException | AmqpException e) {
            //TODO: add retry mechanism
            throw new PublisherDataProviderException(e.getMessage());
        }
    }
}
