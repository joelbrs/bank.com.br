package br.com.joelf.mstransaction.application.services.transactions.validations;

import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.validators.Validator;

public class BalanceValidation implements Validator<TransactionDTOIn> {

    @Override
    public Throwable validate(TransactionDTOIn transactionRequest) {
        return new Throwable();   
    }
}
