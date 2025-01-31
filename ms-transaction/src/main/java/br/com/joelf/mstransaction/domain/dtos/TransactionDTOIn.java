package br.com.joelf.mstransaction.domain.dtos;

import java.math.BigDecimal;

import br.com.joelf.mstransaction.application.annotations.FieldsComparison;
import br.com.joelf.mstransaction.domain.models.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@FieldsComparison(
    firstField = "senderAccountNumber",
    secondField = "receiverAccountNumber",
    message = "The sender and receiver account numbers must be different",
    comparison = FieldsComparison.ComparisonType.DIFFERENT
)
public record TransactionDTOIn(
    @NotBlank
    String senderAccountNumber,

    @NotBlank
    String receiverAccountNumber,

    @NotBlank
    String idempotentKey,

    @NotNull
    @Positive
    BigDecimal amount,
    String description,

    @NotNull
    TransactionType type
) {}
