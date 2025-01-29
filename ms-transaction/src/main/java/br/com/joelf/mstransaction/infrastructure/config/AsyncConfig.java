package br.com.joelf.mstransaction.infrastructure.config;

import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.async.rabbitmq.RabbitMessagePublisher;
import br.com.joelf.mstransaction.infrastructure.async.rabbitmq.listeners.RabbitTransactionMessageListener;

@Configuration
@EnableRabbit
public class AsyncConfig {
    
    private final String transactionQueueName;
    private final RabbitTemplate rabbitTemplate;

    public AsyncConfig(
        @Value("${amqp.queue.transaction.name}") String transactionQueueName,
        RabbitTemplate rabbitTemplate
    ) {
        this.transactionQueueName = transactionQueueName;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Bean("transactionQueue")
    public Queue transactionQueue() {
        return new Queue(transactionQueueName, Boolean.TRUE);
    }

    @Bean("transactionContainer")
    public SimpleMessageListenerContainer transactionContainer(
        ConnectionFactory connectionFactory
    ) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(transactionQueueName);
        container.setMessageListener(transactionListenerAdapter());

        return container;
    }

    @Bean("transactionListenerAdapter")
    public MessageListenerAdapter transactionListenerAdapter() {
        return new MessageListenerAdapter(transactionPublisher());
    }

    @Bean("transactionListener")
    public MessageListener transactionListener(
        TransactionService transactionService
    ) {
        return new RabbitTransactionMessageListener(transactionService);
    }

    @Bean("transactionPublisher")
    public MessagePublisher transactionPublisher() {
        return new RabbitMessagePublisher(rabbitTemplate, transactionQueue());
    }
}
