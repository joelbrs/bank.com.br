package br.com.joelf.wstransaction.infraestructure.repositories.customs;

import java.math.BigDecimal;

public interface TransactionCustomRepository {
    BigDecimal getBalance(String accountIdentifier);
}
