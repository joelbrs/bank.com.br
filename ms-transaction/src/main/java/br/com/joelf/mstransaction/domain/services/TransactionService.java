package br.com.joelf.mstransaction.domain.services;

import br.com.joelf.mstransaction.domain.dtos.IdempotencyKeyDTOIn;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.models.Transaction;

public interface TransactionService {
    void create(TransactionDTOIn dto);
    void proccess(Transaction transaction);
    String generateIdempotencyKey(IdempotencyKeyDTOIn dto);
}
