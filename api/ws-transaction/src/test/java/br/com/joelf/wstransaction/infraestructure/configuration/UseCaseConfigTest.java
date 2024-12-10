package br.com.joelf.wstransaction.infraestructure.configuration;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.usecases.validations.AccountBalanceValidation;
import br.com.joelf.wstransaction.application.usecases.validations.AccountExistanceValidation;
import br.com.joelf.wstransaction.domain.usecases.ProcessTransactionUseCase;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class UseCaseConfigTest {

    @Mock
    private AccountDataProvider accountDataProvider;

    @Mock
    private AuthorizerDataProvider authorizerDataProvider;

    @Mock
    private PublisherDataProvider publisherDataProvider;

    @Mock
    private TransactionDataProvider transactionDataProvider;

    @InjectMocks
    private UseCaseConfig useCaseConfig;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void shouldCreateCreateTransactionUseCaseBean() {
        Validation accountBalanceValidation = new AccountBalanceValidation(transactionDataProvider);
        Validation accountExistanceValidation = new AccountExistanceValidation(accountDataProvider);

        br.com.joelf.wstransaction.domain.usecases.CreateTransactionUseCase createTransactionUseCase = useCaseConfig.createTransactionUseCase(
                accountBalanceValidation,
                accountExistanceValidation,
                transactionDataProvider,
                publisherDataProvider
        );

        assertNotNull(createTransactionUseCase);
    }

    @Test
    public void shouldCreateProcessTransactionUseCaseBean() {
        ProcessTransactionUseCase processTransactionUseCase = useCaseConfig.processTransactionUseCase(authorizerDataProvider, transactionDataProvider);
        assertNotNull(processTransactionUseCase);
    }

    @Test
    public void shouldCreateAccountBalanceValidationBean() {
        Validation accountBalanceValidation = useCaseConfig.accountBalanceValidation(transactionDataProvider);
        assertNotNull(accountBalanceValidation);
    }

    @Test
    public void shouldCreateAccountExistanceValidationBean() {
        Validation accountExistanceValidation = useCaseConfig.accountExistanceValidation(accountDataProvider);
        assertNotNull(accountExistanceValidation);
    }
}
