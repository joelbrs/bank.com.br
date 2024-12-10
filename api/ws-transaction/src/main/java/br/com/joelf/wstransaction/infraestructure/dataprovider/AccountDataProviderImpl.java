package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.infraestructure.repositories.AccountMongoDBRepository;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AccountDataProviderImpl implements AccountDataProvider {

    private final AccountMongoDBRepository repository;

    @Override
    public boolean existsByAccountIdentifier(String accountNumber) {
        return repository.existsByAccountNumber(accountNumber);
    }
}
