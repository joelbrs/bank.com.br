package br.com.joelf.wstransaction.domain.dtos;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class TransactionRequestTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void shouldBeValidTransactionRequestIfAllFieldsAreValid() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("12345");
        request.setAmount(new BigDecimal("100.00"));
        request.setDescription("Test transaction");
        request.setIdempotencyKey("unique-key");

        Set violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "TransactionRequest should be valid");
    }

    @Test
    public void shouldBeInvalidTransactionRequestIfAccountIdentifierIsBlank() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("");
        request.setAmount(new BigDecimal("100.00"));
        request.setDescription("Test transaction");
        request.setIdempotencyKey("unique-key");

        Set violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "TransactionRequest should be invalid due to blank accountIdentifier");
    }

    @Test
    public void shouldBeInvalidTransactionRequestIfAmountIsNegative() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("12345");
        request.setAmount(new BigDecimal("-100.00"));
        request.setDescription("Test transaction");
        request.setIdempotencyKey("unique-key");

        Set violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "TransactionRequest should be invalid due to negative amount");
    }

    @Test
    public void shouldBeInvalidTransactionRequestIfIdempotencyKeyIsBlank() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountIdentifier("12345");
        request.setAmount(new BigDecimal("100.00"));
        request.setDescription("Test transaction");
        request.setIdempotencyKey("");

        Set violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "TransactionRequest should be invalid due to blank idempotencyKey");
    }
}
