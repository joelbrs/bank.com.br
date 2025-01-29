package br.com.joelf.mstransaction.application.services.transactions.validations;

import br.com.joelf.mstransaction.application.services.exceptions.BusinessRuleException;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.database.AccountRepository;

public class ReceiverAccountValidation implements Validator<TransactionDTOIn> {

    private final AccountRepository accountRepository;

    public ReceiverAccountValidation(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public Throwable validate(TransactionDTOIn transactionRequest) {
        boolean existsAccount = 
            accountRepository.existsByAccountNumber(transactionRequest.receiverAccountNumber());

        if (!existsAccount) {
            return new BusinessRuleException("Receiver account not found");
        }
        return null;
    }
}
