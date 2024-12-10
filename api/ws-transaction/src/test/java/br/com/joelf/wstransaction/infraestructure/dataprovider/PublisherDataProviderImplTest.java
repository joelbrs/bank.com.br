package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.exceptions.PublisherDataProviderException;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PublisherDataProviderImplTest {

    @Mock
    private Queue queue;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private PublisherDataProviderImpl publisherDataProvider;

    @Test
    public void shouldThrowPublisherDataProviderExceptionIfAmqpExceptionIsThrown() {
        when(queue.getName())
                .thenReturn("queue-name");

        doThrow(AmqpException.class)
                .when(rabbitTemplate)
                    .convertAndSend(anyString(), anyString());

        assertThrows(PublisherDataProviderException.class, () -> publisherDataProvider.publishTransaction(Transaction.builder().build()));
    }

    @Test
    public void shouldPublishTransactionSuccessfullyIfNoExceptionIsThrown() {
        assertDoesNotThrow(() -> publisherDataProvider.publishTransaction(Transaction.builder().build()));
    }
}
