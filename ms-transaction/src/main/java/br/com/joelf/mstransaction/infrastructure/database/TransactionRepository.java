package br.com.joelf.mstransaction.infrastructure.database;

import java.util.UUID;

import br.com.joelf.mstransaction.domain.models.Transaction;

public interface TransactionRepository {
    Transaction findById(UUID id);
    Transaction save(Transaction transaction);
    UUID update(Transaction transaction);
}
