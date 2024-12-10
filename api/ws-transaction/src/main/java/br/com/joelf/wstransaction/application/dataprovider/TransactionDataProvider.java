package br.com.joelf.wstransaction.application.dataprovider;

import br.com.joelf.wstransaction.domain.entities.Transaction;

import java.math.BigDecimal;

public interface TransactionDataProvider {
    Transaction insert(Transaction transaction);
    void update(Transaction transaction);
    BigDecimal getBalance(String accountIdetifier);
}
