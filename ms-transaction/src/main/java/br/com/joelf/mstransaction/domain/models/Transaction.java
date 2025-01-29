package br.com.joelf.mstransaction.domain.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import br.com.joelf.mstransaction.domain.models.enums.TransactionStatus;
import br.com.joelf.mstransaction.domain.models.enums.TransactionType;

public record Transaction(
    UUID id,
    String senderAccounNumber,
    String receiverAccountNumber,
    BigDecimal amount,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    TransactionStatus status,
    TransactionType type
) {}
