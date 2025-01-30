package br.com.joelf.mstransaction.application.services.transactions.validations;

import java.math.BigDecimal;

import br.com.joelf.mstransaction.application.services.exceptions.BusinessRuleException;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.database.CacheRepository;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class BalanceValidation implements Validator<TransactionDTOIn> {

    private final TransactionRepository transactionRepository;
    private final CacheRepository<String, BigDecimal> cacheRepository;

    public BalanceValidation(
        TransactionRepository transactionRepository,
        CacheRepository<String, BigDecimal> cacheRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.cacheRepository = cacheRepository;
    }

    @Override
    public Throwable validate(TransactionDTOIn transactionRequest) {
        BigDecimal balance = 
            cacheRepository.get(transactionRequest.senderAccountNumber());

        if (balance == null) {
            balance = transactionRepository.getBalance(transactionRequest.senderAccountNumber());
            cacheRepository.put(transactionRequest.senderAccountNumber(), balance);
        }
        
        if (balance.compareTo(transactionRequest.amount()) < 0) {
            return new BusinessRuleException("Insufficient balance");
        }
        return null;
    }
}
