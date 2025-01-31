package br.com.joelf.mstransaction.application.services.transactions;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import br.com.joelf.mstransaction.application.services.exceptions.BusinessRuleException;
import br.com.joelf.mstransaction.domain.dtos.IdempotencyKeyDTOIn;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.TransactionMetrics;
import br.com.joelf.mstransaction.domain.models.enums.TransactionStatus;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.domain.validators.Validator;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.async.exceptions.UnprocessableEntityMessage;
import br.com.joelf.mstransaction.infrastructure.clients.AuthorizerClient;
import br.com.joelf.mstransaction.infrastructure.database.CacheRepository;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;
import feign.FeignException.FeignClientException;

public class TransactionServiceImpl implements TransactionService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    
    private final TransactionRepository transactionRepository;
    private final MessagePublisher transactionMessagePublisher;
    private final AuthorizerClient authorizerClient;
    private final Validator<TransactionDTOIn> validator;
    private final TokenHandler<Object> tokenHandler;

    private final CacheRepository<UUID, Transaction> cacheRepositoryTransaction;
    private final CacheRepository<String, List<TransactionMetrics>> cacheRepositoryMetrics;
    private final CacheRepository<String, BigDecimal> balanceCacheRepository;
    
    public TransactionServiceImpl(
        TransactionRepository transactionRepository,
        MessagePublisher transactionMessagePublisher,
        AuthorizerClient authorizerClient,
        Validator<TransactionDTOIn> validator,
        TokenHandler<Object> tokenHandler,
        CacheRepository<UUID, Transaction> cacheRepositoryTransaction,
        CacheRepository<String, List<TransactionMetrics>> cacheRepositoryMetrics,
        CacheRepository<String, BigDecimal> balanceCacheRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.transactionMessagePublisher = transactionMessagePublisher;
        this.authorizerClient = authorizerClient;
        this.validator = validator;
        this.tokenHandler = tokenHandler;
        this.cacheRepositoryTransaction = cacheRepositoryTransaction;
        this.cacheRepositoryMetrics = cacheRepositoryMetrics;
        this.balanceCacheRepository = balanceCacheRepository;
    }

    @Override
    @Transactional
    public void create(TransactionDTOIn dto) {
        Throwable error = validator.validate(dto);

        if (error != null) {
            throw new BusinessRuleException(error.getMessage());
        }

        Transaction transaction = MAPPER.convertValue(dto, Transaction.class);
        Transaction result = transactionRepository.save(transaction);

        cacheRepositoryTransaction.put(result.getId(), result);
        
        Thread.startVirtualThread(() -> {
            try {
                transactionMessagePublisher.handleMessage(MAPPER.writeValueAsString(result));
            } catch (UnprocessableEntityMessage | JsonProcessingException e) {
                transaction.setStatus(TransactionStatus.ERROR);
                transactionRepository.update(transaction);
            }
        });
    }

    @Override
    public void proccess(Transaction transaction) {
        try {
            authorizerClient.authorize();
            transaction.setStatus(TransactionStatus.COMPLETED);
            clearAccountsCache(
                transaction.getReceiverAccountNumber(), transaction.getSenderAccountNumber()
            );
        } catch (FeignClientException e) {
            transaction.setStatus(TransactionStatus.ERROR);
        }

        //TODO: send success notification
        transactionRepository.update(transaction);
    }

    @Override
    public String generateIdempotencyKey(IdempotencyKeyDTOIn dto) {
        String issuer = "ms-transaction";
        String subject = 
            dto.receiverAccountNumber() + dto.senderAccountNumber();

        return tokenHandler.generateToken(issuer, subject, dto);
    }

    @Override
    public List<TransactionMetrics> getMetricsByAccountNumber(String accountNumber) {
        List<TransactionMetrics> metrics = 
            cacheRepositoryMetrics.get(accountNumber);
        
        if (metrics != null) {
            return metrics;
        }

        metrics = transactionRepository.getMetricsByAccountNumber(accountNumber);
        cacheRepositoryMetrics.put(accountNumber, metrics);
        return metrics;
    }

    private void clearAccountsCache(String receiverAccountNumber, String senderAccountNumber) {
        cacheRepositoryMetrics.delete(receiverAccountNumber, senderAccountNumber);
        balanceCacheRepository.delete(receiverAccountNumber, senderAccountNumber);
    }
}
