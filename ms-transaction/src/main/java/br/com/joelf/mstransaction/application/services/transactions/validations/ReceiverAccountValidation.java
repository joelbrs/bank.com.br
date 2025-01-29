package br.com.joelf.mstransaction.application.services.transactions.validations;

import br.com.joelf.mstransaction.application.validators.Validator;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;

public class ReceiverAccountValidation implements Validator<TransactionDTOIn> {

    @Override
    public Throwable validate(TransactionDTOIn transactionRequest) {
        return new Throwable();   
    }
}
