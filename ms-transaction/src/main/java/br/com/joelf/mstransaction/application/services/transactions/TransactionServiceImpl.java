package br.com.joelf.mstransaction.application.services.transactions;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.joelf.mstransaction.application.validators.Validator;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.enums.TransactionStatus;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.clients.AuthorizerClient;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;
import feign.FeignException.FeignClientException;

public class TransactionServiceImpl implements TransactionService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    
    private final TransactionRepository transactionRepository;
    private final MessagePublisher transactionMessagePublisher;
    private final AuthorizerClient authorizerClient;
    private final Validator<TransactionDTOIn> validator;
    
    public TransactionServiceImpl(
        TransactionRepository transactionRepository,
        MessagePublisher transactionMessagePublisher,
        AuthorizerClient authorizerClient,
        Validator<TransactionDTOIn> validator
    ) {
        this.transactionRepository = transactionRepository;
        this.transactionMessagePublisher = transactionMessagePublisher;
        this.authorizerClient = authorizerClient;
        this.validator = validator;
    }

    @Override
    public void create(TransactionDTOIn dto) {
        Throwable error = validator.validate(dto);

        if (error != null) {
            //TODO: handle it
        }

        Transaction transaction = MAPPER.convertValue(dto, Transaction.class);
        transaction = transactionRepository.save(transaction);
        
        try {
            transactionMessagePublisher.handleMessage(MAPPER.writeValueAsString(transaction));
        } catch (Exception e) {
            // TODO: handle it
        }
    }

    @Override
    public void proccess(Transaction transaction) {
        try {
            authorizerClient.authorize();
            transaction.setStatus(TransactionStatus.COMPLETED);
        } catch (FeignClientException e) {
            transaction.setStatus(TransactionStatus.ERROR);
        }

        //TODO: send success notification
        transactionRepository.update(transaction);
    }
}
