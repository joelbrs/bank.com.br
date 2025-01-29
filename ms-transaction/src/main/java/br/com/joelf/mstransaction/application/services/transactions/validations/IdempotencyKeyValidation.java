package br.com.joelf.mstransaction.application.services.transactions.validations;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class IdempotencyKeyValidation implements Validator<TransactionDTOIn> {

    private final TransactionRepository transactionRepository;
    private final TokenHandler<Object> tokenHandler;

    public IdempotencyKeyValidation(
        TransactionRepository transactionRepository,
        TokenHandler<Object> tokenHandler
    ) {
        this.transactionRepository = transactionRepository;
        this.tokenHandler = tokenHandler;
    }

    /**
     * 1. Verify if the idempotency key exists (first in cache, then in the database)
     * 2. Validate if the idempotency key is valid
     */
    @Override
    public Throwable validate(TransactionDTOIn dto) {
        String idempotencyKey = dto.idempotentKey();
        boolean exists = transactionRepository.existsByIdempotencyKey(idempotencyKey);
        
        if (exists) {
            return new IllegalArgumentException("Idempotency key already exists");            
        }
        
        boolean isIdempotencyKeyValid = tokenHandler.validateToken(idempotencyKey);

        if (!isIdempotencyKeyValid) {
            return new IllegalArgumentException("Idempotency key is invalid");
        }
        return null;
    }
}
