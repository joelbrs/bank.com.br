package br.com.joelf.mstransaction.infrastructure.config;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import br.com.joelf.mstransaction.application.services.transactions.TransactionServiceImpl;
import br.com.joelf.mstransaction.application.services.transactions.validations.BalanceValidation;
import br.com.joelf.mstransaction.application.services.transactions.validations.IdempotencyKeyValidation;
import br.com.joelf.mstransaction.application.services.transactions.validations.ReceiverAccountValidation;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.TransactionMetrics;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.clients.AuthorizerClient;
import br.com.joelf.mstransaction.infrastructure.database.AccountRepository;
import br.com.joelf.mstransaction.infrastructure.database.CacheRepository;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;
import br.com.joelf.mstransaction.infrastructure.validators.ValidatorComposite;

@Configuration
public class ServiceConfig {

    private final AccountRepository accountRepository;

    public ServiceConfig(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Bean
    public TransactionService transactionService(
        TransactionRepository transactionRepository,
        @Qualifier("transactionPublisher") MessagePublisher transactionMessagePublisher,
        AuthorizerClient authorizerClient,
        TokenHandler<Object> tokenHandler,
        CacheRepository<UUID, Transaction> cacheRepositoryTransaction,
        CacheRepository<String, List<TransactionMetrics>> cacheRepositoryMetrics,
        CacheRepository<String, UUID> cacheRepositoryIdempotencyKey,
        CacheRepository<String, BigDecimal> cacheRepositoryBalance
    ) {
        
        Validator<TransactionDTOIn> validator = new ValidatorComposite<>(
            new IdempotencyKeyValidation(transactionRepository, tokenHandler, cacheRepositoryIdempotencyKey),
            new ReceiverAccountValidation(accountRepository),
            new BalanceValidation(transactionRepository, cacheRepositoryBalance)
        );

        return new TransactionServiceImpl(
            transactionRepository,
            transactionMessagePublisher,
            authorizerClient,
            validator,
            tokenHandler,
            cacheRepositoryTransaction,
            cacheRepositoryMetrics,
            cacheRepositoryBalance
        );
    }
}
