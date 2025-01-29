package br.com.joelf.mstransaction.application.services.transactions.validations;

import java.math.BigDecimal;

import br.com.joelf.mstransaction.application.services.exceptions.BusinessRuleException;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class BalanceValidation implements Validator<TransactionDTOIn> {

    private final TransactionRepository transactionRepository;

    public BalanceValidation(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Throwable validate(TransactionDTOIn transactionRequest) {
        BigDecimal balance = 
            transactionRepository.getBalance(transactionRequest.senderAccountNumber());
        
        if (balance.compareTo(transactionRequest.amount()) < 0) {
            return new BusinessRuleException("Insufficient balance");
        }
        return null;
    }
}
