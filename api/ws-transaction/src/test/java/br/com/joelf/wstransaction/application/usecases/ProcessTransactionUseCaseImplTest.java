package br.com.joelf.wstransaction.application.usecases;

import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.exceptions.AuthorizerDataProviderException;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class ProcessTransactionUseCaseImplTest {

    @Mock
    private AuthorizerDataProvider authorizerDataProvider;

    @Mock
    private TransactionDataProvider transactionDataProvider;

    @InjectMocks
    private ProcessTransactionUseCaseImpl processTransactionUseCase;

    @Test
    public void shouldUpdateTransactionToSuccessIfAuthorizationSucceeds() {
        Transaction transaction = Transaction.builder().build();
        transaction.setId(1L);
        transaction.setStatus(TransactionStatusEnum.PENDING);

        processTransactionUseCase.execute(transaction);

        verify(authorizerDataProvider).authorize();
        verify(transactionDataProvider).update(transaction);
        assertEquals(TransactionStatusEnum.SUCCESS, transaction.getStatus());
    }

    @Test
    public void shouldThrowAuthorizerDataProviderExceptionIfAuthorizationFails() {
        Transaction transaction = Transaction.builder().build();
        transaction.setId(1L);
        transaction.setStatus(TransactionStatusEnum.PENDING);

        doThrow(new AuthorizerDataProviderException("Authorization failed"))
                .when(authorizerDataProvider).authorize();

        assertThrows(AuthorizerDataProviderException.class, () -> {
            processTransactionUseCase.execute(transaction);
        });
    }
}
