package br.com.joelf.mstransaction.infrastructure.database;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.TransactionMetrics;

public interface TransactionRepository {
    Transaction findById(UUID id);
    Transaction save(Transaction transaction);
    UUID update(Transaction transaction);
    BigDecimal getBalance(String accountNumber);
    UUID findTransactionIdByIdempotencyKey(String idempotencyKey);
    List<TransactionMetrics> getMetricsByAccountNumber(String accountNumber);
}
