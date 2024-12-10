package br.com.joelf.wstransaction.infraestructure.configuration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AmqpConfigTest {

    @Mock
    private ConnectionFactory connectionFactory;

    @InjectMocks
    private AmqpConfig amqpConfig;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        amqpConfig = new AmqpConfig();

        ReflectionTestUtils.setField(
                amqpConfig, "transactionQueue", "test-transaction-queue"
        );
    }

    @Test
    public void shouldCreateTransactionQueueBean() {
        Queue queue = amqpConfig.transactionQueue();

        assertEquals("test-transaction-queue", queue.getName());
        assertTrue(queue.isDurable());
    }

    @Test
    public void shouldCreateRabbitTemplateBean() {
        RabbitTemplate rabbitTemplate = amqpConfig.rabbitTemplate(connectionFactory);

        assertEquals(connectionFactory, rabbitTemplate.getConnectionFactory());
    }
}
