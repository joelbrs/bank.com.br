package br.com.joelf.wstransaction.domain.usecases;

import br.com.joelf.wstransaction.domain.entities.Transaction;

@FunctionalInterface
public interface ProcessTransactionUseCase {
    void execute(Transaction transaction);
}
