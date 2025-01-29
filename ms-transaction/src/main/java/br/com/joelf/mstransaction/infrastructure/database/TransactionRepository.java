package br.com.joelf.mstransaction.infrastructure.database;

import java.math.BigDecimal;
import java.util.UUID;

import br.com.joelf.mstransaction.domain.models.Transaction;

public interface TransactionRepository {
    Transaction findById(UUID id);
    Transaction save(Transaction transaction);
    UUID update(Transaction transaction);
    BigDecimal getBalance(String accountNumber);
    boolean existsByIdempotencyKey(String idempotencyKey);
}
