package br.com.joelf.mstransaction.domain.services;

import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;

public interface TransactionService {
    void create(TransactionDTOIn dto);
}
