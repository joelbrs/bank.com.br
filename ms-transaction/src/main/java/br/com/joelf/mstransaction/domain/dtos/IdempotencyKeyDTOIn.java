package br.com.joelf.mstransaction.domain.dtos;

import java.math.BigDecimal;

import br.com.joelf.mstransaction.domain.models.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record IdempotencyKeyDTOIn(
    @NotBlank
    String senderAccountNumber,

    @NotBlank
    String receiverAccountNumber,

    @NotNull
    @Positive
    BigDecimal amount,

    @NotNull
    TransactionType type
) {}
