package br.com.joelf.wstransaction.infraestructure.configuration;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.infraestructure.dataprovider.AccountDataProviderImpl;
import br.com.joelf.wstransaction.infraestructure.dataprovider.AuthorizerDataProviderImpl;
import br.com.joelf.wstransaction.infraestructure.dataprovider.PublisherDataProviderImpl;
import br.com.joelf.wstransaction.infraestructure.dataprovider.TransactionDataProviderImpl;
import br.com.joelf.wstransaction.infraestructure.repositories.AccountMongoDBRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.AuthorizerClient;
import br.com.joelf.wstransaction.infraestructure.repositories.TransactionMongoDBRepository;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataProviderConfig {

    @Bean
    public PublisherDataProvider publisherDataProvider(
            @Qualifier("transactionQueue") Queue queue,
            RabbitTemplate rabbitTemplate
    ) {
        return new PublisherDataProviderImpl(queue, rabbitTemplate);
    }

    @Bean
    public TransactionDataProvider transactionDataProvider(
            TransactionMongoDBRepository repository
    ) {
        return new TransactionDataProviderImpl(repository);
    }

    @Bean
    public AccountDataProvider accountDataProvider(
            AccountMongoDBRepository repository
    ) {
        return new AccountDataProviderImpl(repository);
    }

    @Bean
    public AuthorizerDataProvider authorizerDataProvider(
            AuthorizerClient authorizerClient
    ) {
        return new AuthorizerDataProviderImpl(authorizerClient);
    }
}
