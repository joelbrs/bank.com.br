package br.com.joelf.mstransaction.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.mstransaction.application.services.TransactionServiceImpl;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.clients.AuthorizerClient;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

@Configuration
public class ServiceConfig {
    
    @Bean
    public TransactionService transactionService(
        TransactionRepository transactionRepository,
        MessagePublisher messagePublisher,
        AuthorizerClient authorizerClient
    ) {
        return new TransactionServiceImpl(
            transactionRepository,
            messagePublisher,
            authorizerClient
        );
    }
}
