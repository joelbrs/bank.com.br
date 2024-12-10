package br.com.joelf.wstransaction.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TransactionStatusEnum {
    PENDING(1L, "PENDENTE_PROCESSAMENTO"),
    SUCCESS(2L, "SUCESSO"),
    UNAUTHORIZED(3L, "NAO_AUTORIZADA"),
    ERROR_PROCESSING(4L, "ERRO_PROCESSMENTO");

    private final Long code;
    private final String description;
}
