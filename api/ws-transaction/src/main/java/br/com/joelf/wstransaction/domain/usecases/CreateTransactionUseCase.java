package br.com.joelf.wstransaction.domain.usecases;

import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;

@FunctionalInterface
public interface CreateTransactionUseCase {
    void execute(TransactionRequest request);
}
