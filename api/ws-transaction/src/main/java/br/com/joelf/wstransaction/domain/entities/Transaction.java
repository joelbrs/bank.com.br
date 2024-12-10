package br.com.joelf.wstransaction.domain.entities;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class Transaction {
    private Long id;
    private TransactionStatusEnum status;
    private String description;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String payerAccountIdentifier;
    private String receiverAccountIdentifier;
    private String idempotencyKey;
}
