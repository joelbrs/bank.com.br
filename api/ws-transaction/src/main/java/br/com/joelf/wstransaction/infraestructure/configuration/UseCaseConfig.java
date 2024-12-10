package br.com.joelf.wstransaction.infraestructure.configuration;

import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.usecases.CreateTransactionUseCaseImpl;
import br.com.joelf.wstransaction.application.usecases.validations.AccountBalanceValidation;
import br.com.joelf.wstransaction.application.usecases.validations.ValidationComposite;
import br.com.joelf.wstransaction.domain.usecases.CreateTransactionUseCase;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class UseCaseConfig {

    @Bean
    public CreateTransactionUseCase createTransactionUseCase(
            @Qualifier("accountBalanceValidation") Validation accounBalanceValidation,
            TransactionDataProvider transactionDataProvider,
            PublisherDataProvider publisherDataProvider
    ) {
        Validation validationComposite =
                new ValidationComposite(Collections.singletonList(accounBalanceValidation));

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
}
