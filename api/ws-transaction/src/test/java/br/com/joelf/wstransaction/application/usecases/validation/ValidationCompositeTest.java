package br.com.joelf.wstransaction.application.usecases.validation;

import br.com.joelf.wstransaction.application.usecases.validations.ValidationComposite;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import br.com.joelf.wstransaction.domain.usecases.validations.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ValidationCompositeTest {

    @Mock
    private Validation validation1;

    @Mock
    private Validation validation2;

    @InjectMocks
    private ValidationComposite validationComposite;

    @Test
    public void shouldCallAllValidationsIfCompositeIsValidated() {
        Object request = new Object();

        validationComposite = new ValidationComposite(Arrays.asList(validation1, validation2));
        validationComposite.validate(request);

        verify(validation1).validate(request);
        verify(validation2).validate(request);
    }

    @Test
    public void shouldThrowValidationExceptionIfAnyValidationFails() {
        Object request = new Object();

        doThrow(new ValidationException("Validation failed")).when(validation1).validate(request);
        validationComposite = new ValidationComposite(Arrays.asList(validation1, validation2));

        assertThrows(ValidationException.class, () -> {
            validationComposite.validate(request);
        });

        verify(validation1).validate(request);
        verify(validation2, never()).validate(request);
    }
}
