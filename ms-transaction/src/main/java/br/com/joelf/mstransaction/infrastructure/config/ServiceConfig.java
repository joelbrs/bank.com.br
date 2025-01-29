package br.com.joelf.mstransaction.infrastructure.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.mstransaction.application.services.transactions.TransactionServiceImpl;
import br.com.joelf.mstransaction.application.services.transactions.validations.BalanceValidation;
import br.com.joelf.mstransaction.application.services.transactions.validations.ReceiverAccountValidation;
import br.com.joelf.mstransaction.application.validators.Validator;
import br.com.joelf.mstransaction.application.validators.ValidatorComposite;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.clients.AuthorizerClient;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

@Configuration
public class ServiceConfig {
    
    @Bean
    public TransactionService transactionService(
        TransactionRepository transactionRepository,
        @Qualifier("transactionPublisher") MessagePublisher transactionMessagePublisher,
        AuthorizerClient authorizerClient
    ) {
        
        @SuppressWarnings({ "rawtypes", "unchecked" })
        Validator<TransactionDTOIn> validator = new ValidatorComposite(
            new BalanceValidation(), new ReceiverAccountValidation()
        );

        return new TransactionServiceImpl(
            transactionRepository,
            transactionMessagePublisher,
            authorizerClient,
            validator
        );
    }
}
