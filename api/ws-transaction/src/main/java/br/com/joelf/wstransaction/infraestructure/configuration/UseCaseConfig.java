package br.com.joelf.wstransaction.infraestructure.configuration;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.usecases.CreateTransactionUseCaseImpl;
import br.com.joelf.wstransaction.application.usecases.validations.AccountBalanceValidation;
import br.com.joelf.wstransaction.application.usecases.validations.AccountExistanceValidation;
import br.com.joelf.wstransaction.application.usecases.validations.ValidationComposite;
import br.com.joelf.wstransaction.domain.usecases.CreateTransactionUseCase;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;

@Configuration
public class UseCaseConfig {

    @Bean
    public CreateTransactionUseCase createTransactionUseCase(
            @Qualifier("accountBalanceValidation") Validation accounBalanceValidation,
            @Qualifier("accountExistanceValidation") Validation accountExistanceValidation,
            TransactionDataProvider transactionDataProvider,
            PublisherDataProvider publisherDataProvider
    ) {
        Validation validationComposite = new ValidationComposite(
                List.of(accounBalanceValidation, accountExistanceValidation)
        );

        return new CreateTransactionUseCaseImpl(
                validationComposite, transactionDataProvider, publisherDataProvider
        );
    }

    @Bean("accountBalanceValidation")
    public Validation accountBalanceValidation(
            TransactionDataProvider transactionDataProvider
    ) {
        return new AccountBalanceValidation(transactionDataProvider);
    }

    @Bean("accountExistanceValidation")
    public Validation accountExistanceValidation(
            AccountDataProvider accountDataProvider
    ) {
        return new AccountExistanceValidation(accountDataProvider);
    }
}
