package br.com.joelf.wstransaction.application.usecases.validation;

import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.usecases.validations.AccountBalanceValidation;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.usecases.validations.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AccountBalanceValidationTest {

    @Mock
    private TransactionDataProvider transactionDataProvider;

    @InjectMocks
    private AccountBalanceValidation accountBalanceValidation;

    @Test
    public void shouldThrowValidationExceptionIfInsufficientBalance() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");
        request.setAmount(new BigDecimal("100.00"));

        when(transactionDataProvider.getBalance("account123")).thenReturn(new BigDecimal("50.00"));

        assertThrows(ValidationException.class, () -> {
            accountBalanceValidation.validate(request);
        });
    }

    @Test
    public void shouldNotThrowValidationExceptionIfSufficientBalance() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");
        request.setAmount(new BigDecimal("50.00"));

        when(transactionDataProvider.getBalance("account123")).thenReturn(new BigDecimal("100.00"));

        accountBalanceValidation.validate(request);
    }

    @Test
    public void shouldNotThrowValidationExceptionIfBalanceIsExactlyEqual() {
        BigDecimal amount = BigDecimal.valueOf(50);

        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");
        request.setAmount(amount);

        when(transactionDataProvider.getBalance("account123"))
                .thenReturn(amount);

        assertDoesNotThrow(() -> accountBalanceValidation.validate(request));
    }

    @Test
    public void shouldThrowValidationExceptionIfBalanceIsZero() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");
        request.setAmount(new BigDecimal("1.00"));

        when(transactionDataProvider.getBalance("account123")).thenReturn(BigDecimal.ZERO);

        assertThrows(ValidationException.class, () -> {
            accountBalanceValidation.validate(request);
        });
    }
}
