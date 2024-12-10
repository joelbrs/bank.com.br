package br.com.joelf.wstransaction.infraestructure.configuration;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.infraestructure.repositories.database.AccountMongoDBRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.database.TransactionMongoDBRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.https.AuthorizerClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class DataProviderConfigTest {

    @InjectMocks
    private DataProviderConfig dataProviderConfig;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private Queue transactionQueue;

    @Mock
    private TransactionMongoDBRepository transactionMongoDBRepository;

    @Mock
    private AccountMongoDBRepository accountMongoDBRepository;

    @Mock
    private AuthorizerClient authorizerClient;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void shouldCreatePublisherDataProviderBean() {
        PublisherDataProvider publisherDataProvider = dataProviderConfig.publisherDataProvider(transactionQueue, rabbitTemplate);
        assertNotNull(publisherDataProvider);
    }

    @Test
    public void shouldCreateTransactionDataProviderBean() {
        TransactionDataProvider transactionDataProvider = dataProviderConfig.transactionDataProvider(transactionMongoDBRepository);
        assertNotNull(transactionDataProvider);
    }

    @Test
    public void shouldCreateAccountDataProviderBean() {
        AccountDataProvider accountDataProvider = dataProviderConfig.accountDataProvider(accountMongoDBRepository);
        assertNotNull(accountDataProvider);
    }

    @Test
    public void shouldCreateAuthorizerDataProviderBean() {
        AuthorizerDataProvider authorizerDataProvider = dataProviderConfig.authorizerDataProvider(authorizerClient);
        assertNotNull(authorizerDataProvider);
    }
}
