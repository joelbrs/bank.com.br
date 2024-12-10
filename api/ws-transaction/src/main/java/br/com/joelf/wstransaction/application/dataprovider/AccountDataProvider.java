package br.com.joelf.wstransaction.application.dataprovider;

public interface AccountDataProvider {
    boolean existsByAccountIdentifier(String accountNumber);
}
