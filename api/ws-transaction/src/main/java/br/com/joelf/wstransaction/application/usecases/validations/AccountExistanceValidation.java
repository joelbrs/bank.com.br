package br.com.joelf.wstransaction.application.usecases.validations;

import br.com.joelf.wstransaction.application.dataprovider.AccountDataProvider;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import br.com.joelf.wstransaction.domain.usecases.validations.ValidationException;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AccountExistanceValidation implements Validation {

    private final AccountDataProvider accountDataProvider;

    @Override
    public void validate(Object object) {
        TransactionRequest request = (TransactionRequest) object;

        boolean isAccountExists =
                accountDataProvider.existsByAccountIdentifier(request.getAccountIdentifier());

        if (!isAccountExists) {
           throw new ValidationException("Receiver's account does not exists.");
        }
    }
}
