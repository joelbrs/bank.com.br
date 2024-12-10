package br.com.joelf.wstransaction.application.usecases.validation;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.application.usecases.validations.AccountExistanceValidation;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.usecases.validations.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AccountExistanceValidationTest {

    @Mock
    private AccountDataProvider accountDataProvider;

    @InjectMocks
    private AccountExistanceValidation accountExistanceValidation;

    @Test
    public void shouldThrowValidationExceptionIfAccountDoesNotExist() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");

        when(accountDataProvider.existsByAccountIdentifier("account123")).thenReturn(false);

        assertThrows(ValidationException.class, () -> {
            accountExistanceValidation.validate(request);
        });
    }

    @Test
    public void shouldNotThrowValidationExceptionIfAccountExists() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("account123");

        when(accountDataProvider.existsByAccountIdentifier("account123")).thenReturn(true);

        accountExistanceValidation.validate(request);
    }
}
