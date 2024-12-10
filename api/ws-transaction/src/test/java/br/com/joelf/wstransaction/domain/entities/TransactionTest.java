package br.com.joelf.wstransaction.domain.entities;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class TransactionTest {

    @Test
    public void shouldSetAndGetFieldsCorrectlyIfTransactionIsCreated() {
        LocalDateTime now = LocalDateTime.now();
        Transaction transaction = Transaction.builder()
                .id(1L)
                .status(TransactionStatusEnum.PENDING)
                .description("Test transaction")
                .amount(new BigDecimal("100.00"))
                .createdAt(now)
                .updatedAt(now)
                .payerAccountIdentifier("payer123")
                .receiverAccountIdentifier("receiver456")
                .idempotencyKey("unique-key")
                .build();

        assertEquals(1L, transaction.getId());
        assertEquals(TransactionStatusEnum.PENDING, transaction.getStatus());
        assertEquals("Test transaction", transaction.getDescription());
        assertEquals(new BigDecimal("100.00"), transaction.getAmount());
        assertEquals(now, transaction.getCreatedAt());
        assertEquals(now, transaction.getUpdatedAt());
        assertEquals("payer123", transaction.getPayerAccountIdentifier());
        assertEquals("receiver456", transaction.getReceiverAccountIdentifier());
        assertEquals("unique-key", transaction.getIdempotencyKey());
    }

    @Test
    public void shouldInitializeTransactionFieldsIfTransactionIsCreatedWithDefaultConstructor() {
        Transaction transaction = Transaction.builder().build();

        assertNull(transaction.getId());
        assertNull(transaction.getStatus());
        assertNull(transaction.getDescription());
        assertNull(transaction.getAmount());
        assertNull(transaction.getCreatedAt());
        assertNull(transaction.getUpdatedAt());
        assertNull(transaction.getPayerAccountIdentifier());
        assertNull(transaction.getReceiverAccountIdentifier());
        assertNull(transaction.getIdempotencyKey());
    }
}