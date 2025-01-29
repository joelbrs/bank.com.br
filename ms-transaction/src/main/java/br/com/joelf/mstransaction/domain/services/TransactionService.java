package br.com.joelf.mstransaction.domain.services;

import java.util.List;

import br.com.joelf.mstransaction.domain.dtos.IdempotencyKeyDTOIn;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.TransactionMetrics;

public interface TransactionService {
    void create(TransactionDTOIn dto);
    void proccess(Transaction transaction);
    String generateIdempotencyKey(IdempotencyKeyDTOIn dto);
    List<TransactionMetrics> getMetricsByAccountNumber(String accountNumber);
}
