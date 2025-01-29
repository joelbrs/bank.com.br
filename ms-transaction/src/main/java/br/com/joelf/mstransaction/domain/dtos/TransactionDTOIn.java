package br.com.joelf.mstransaction.domain.dtos;

import java.math.BigDecimal;

import org.hibernate.validator.constraints.UUID;

import br.com.joelf.mstransaction.domain.models.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransactionDTOIn(
    @NotBlank
    String senderAccountNumber,

    @NotBlank
    String receiverAccountNumber,

    @NotBlank
    @UUID
    String idempotentKey,

    @NotNull
    @Positive
    BigDecimal amount,
    String description,

    @NotNull
    TransactionType type
) {}
