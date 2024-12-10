package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.infraestructure.repositories.database.TransactionMongoDBRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.database.entities.TransactionMongoDB;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TransactionDataProviderImplTest {

    @Mock
    private TransactionMongoDBRepository repository;

    @InjectMocks
    private TransactionDataProviderImpl transactionDataProvider;

    @Test
    public void shouldInsertTransactionAndReturnTransactionWhenInsertIsCalled() {
        Transaction transaction = Transaction.builder().build();

        TransactionMongoDB transactionMongoDB = new TransactionMongoDB();
        when(repository.save(any(TransactionMongoDB.class)))
                .thenReturn(transactionMongoDB);

        assertNotNull(transactionDataProvider.insert(transaction));
    }

    @Test
    public void shouldUpdateTransactionByCallingInsert() {
        Transaction transaction = Transaction.builder().build();
        transaction.setId(1L);
        transaction.setAmount(new BigDecimal("100.00"));

        transactionDataProvider.update(transaction);
    }

    @Test
    public void shouldReturnBalanceWhenGetBalanceIsCalled() {
        String accountIdentifier = "account123";
        BigDecimal expectedBalance = new BigDecimal("250.00");

        when(repository.getBalance(accountIdentifier)).thenReturn(expectedBalance);

        BigDecimal balance = transactionDataProvider.getBalance(accountIdentifier);

        assertEquals(expectedBalance, balance);
    }
}
