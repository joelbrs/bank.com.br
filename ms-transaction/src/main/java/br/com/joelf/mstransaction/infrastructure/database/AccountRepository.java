package br.com.joelf.mstransaction.infrastructure.database;

public interface AccountRepository {
    boolean existsByAccountNumber(String accountNumber);
}
