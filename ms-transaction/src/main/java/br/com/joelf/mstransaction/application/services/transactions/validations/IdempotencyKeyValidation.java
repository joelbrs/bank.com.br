package br.com.joelf.mstransaction.application.services.transactions.validations;

import java.util.UUID;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.database.CacheRepository;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class IdempotencyKeyValidation implements Validator<TransactionDTOIn> {

    private final TransactionRepository transactionRepository;
    private final TokenHandler<Object> tokenHandler;
    private final CacheRepository<String, UUID> cacheRepository;

    private static final String ITEMPOTENCY_EXISTS_ERROR_MSG = "Idempotency key already exists";
    private static final String ITEMPOTENCY_INVALID_ERROR_MSG = "Idempotency key is invalid";

    public IdempotencyKeyValidation(
        TransactionRepository transactionRepository,
        TokenHandler<Object> tokenHandler,
        CacheRepository<String, UUID> cacheRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.tokenHandler = tokenHandler;
        this.cacheRepository = cacheRepository;
    }

    @Override
    public Throwable validate(TransactionDTOIn dto) {
        String idempotencyKey = dto.idempotentKey();
        UUID existingTransactionByIdempotencyKey = cacheRepository.get(idempotencyKey);

        if (existingTransactionByIdempotencyKey != null) {
            return new IllegalArgumentException(ITEMPOTENCY_EXISTS_ERROR_MSG);
        } else {
            existingTransactionByIdempotencyKey = 
                transactionRepository.findTransactionIdByIdempotencyKey(idempotencyKey);

            if (existingTransactionByIdempotencyKey != null) {
                cacheRepository.put(idempotencyKey, existingTransactionByIdempotencyKey);
                return new IllegalArgumentException(ITEMPOTENCY_EXISTS_ERROR_MSG);
            }
        }
        
        boolean isIdempotencyKeyValid = tokenHandler.validateToken(idempotencyKey);

        if (!isIdempotencyKeyValid) {
            return new IllegalArgumentException(ITEMPOTENCY_INVALID_ERROR_MSG);
        }
        return null;
    }
}
