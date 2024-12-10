package br.com.joelf.wstransaction.infraestructure.repositories.database.customs;

import java.math.BigDecimal;

public interface TransactionCustomRepository {
    BigDecimal getBalance(String accountIdentifier);
}
