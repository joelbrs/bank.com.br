package br.com.joelf.wstransaction.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransactionRequest {

    @NotBlank
    private String accountIdentifier;

    @Positive
    private BigDecimal amount;
    private String description;

    @NotBlank
    private String idempotencyKey;
}
