package br.com.joelf.wstransaction.domain.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TransactionStatusEnumTest {

    @Test
    public void shouldReturnCorrectCodeAndDescriptionForPending() {
        TransactionStatusEnum status = TransactionStatusEnum.PENDING;
        assertEquals(1L, status.getCode());
        assertEquals("PENDENTE_PROCESSAMENTO", status.getDescription());
    }

    @Test
    public void shouldReturnCorrectCodeAndDescriptionForSuccess() {
        TransactionStatusEnum status = TransactionStatusEnum.SUCCESS;
        assertEquals(2L, status.getCode());
        assertEquals("SUCESSO", status.getDescription());
    }

    @Test
    public void shouldReturnCorrectCodeAndDescriptionForUnauthorized() {
        TransactionStatusEnum status = TransactionStatusEnum.UNAUTHORIZED;
        assertEquals(3L, status.getCode());
        assertEquals("NAO_AUTORIZADA", status.getDescription());
    }

    @Test
    public void shouldReturnCorrectCodeAndDescriptionForErrorProcessing() {
        TransactionStatusEnum status = TransactionStatusEnum.ERROR_PROCESSING;
        assertEquals(4L, status.getCode());
        assertEquals("ERRO_PROCESSMENTO", status.getDescription());
    }
}
