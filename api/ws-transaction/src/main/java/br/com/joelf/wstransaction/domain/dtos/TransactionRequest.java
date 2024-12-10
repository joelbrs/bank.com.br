package br.com.joelf.wstransaction.domain.dtos;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class TransactionRequest {

    private String accountIdentifier;
    private BigDecimal amount;
    private String description;
    private String idempotencyKey;
}
