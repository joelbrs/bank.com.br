package br.com.joelf.wstransaction.application.usecases;

import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import br.com.joelf.wstransaction.domain.usecases.exceptions.CreateTransactionUseCaseException;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import br.com.joelf.wstransaction.domain.usecases.validations.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CreateTransactionUseCaseImplTest {

    @Mock
    private Validation validation;

    @Mock
    private TransactionDataProvider transactionDataProvider;

    @Mock
    private PublisherDataProvider publisherDataProvider;

    @InjectMocks
    private CreateTransactionUseCaseImpl createTransactionUseCase;

    @Test
    public void shouldThrowCreateTransactionUseCaseExceptionIfValidationFails() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");
        request.setAmount(new BigDecimal("100.00"));
        request.setIdempotencyKey("unique-key");

        doThrow(new ValidationException("Validation failed")).when(validation).validate(request);

        assertThrows(CreateTransactionUseCaseException.class, () -> {
            createTransactionUseCase.execute(request);
        });
    }

    @Test
    public void shouldInsertTransactionAndPublishIfValidationSucceeds() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");
        request.setAmount(new BigDecimal("100.00"));
        request.setIdempotencyKey("unique-key");

        Transaction transaction = Transaction.builder().build();
        transaction.setId(1L);
        transaction.setAmount(request.getAmount());
        transaction.setReceiverAccountIdentifier(request.getAccountIdentifier());
        transaction.setIdempotencyKey(request.getIdempotencyKey());
        transaction.setStatus(TransactionStatusEnum.PENDING);

        when(transactionDataProvider.insert(any())).thenReturn(transaction);

        createTransactionUseCase.execute(request);

        verify(validation).validate(request);
        verify(transactionDataProvider).insert(any());
        verify(publisherDataProvider).publishTransaction(transaction);
    }
}
