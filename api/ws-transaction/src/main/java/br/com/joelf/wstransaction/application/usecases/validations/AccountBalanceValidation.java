package br.com.joelf.wstransaction.application.usecases.validations;

import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
public class AccountBalanceValidation implements Validation {

    private final TransactionDataProvider transactionDataProvider;

    @Override
    public void validate(Object object) {
        TransactionRequest request = (TransactionRequest) object;
        BigDecimal balance = transactionDataProvider.getBalance(request.getAccountIdentifier());

        if (isInvalidAmount(request.getAmount())) {
            //TODO: add exception treatments
        }

        if (!isSufficientBalance(request.getAmount(), balance)) {
            //TODO: add exception treatments
        }
    }

    private boolean isInvalidAmount(BigDecimal amount) {
        return amount.compareTo(BigDecimal.ZERO) <= 0;
    }

    private boolean isSufficientBalance(BigDecimal amount, BigDecimal balance) {
        return balance.compareTo(amount) > 0 && balance.compareTo(BigDecimal.ZERO) > 0;
    }
}
