package br.com.joelf.mstransaction.domain.models;

import java.time.LocalDateTime;

import br.com.joelf.mstransaction.domain.models.enums.AccountStatus;

public record Account(
    String accountNumber,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    AccountStatus status
) {}
