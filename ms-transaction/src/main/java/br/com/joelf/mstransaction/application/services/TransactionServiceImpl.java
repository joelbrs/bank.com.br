package br.com.joelf.mstransaction.application.services;

import com.fasterxml.jackson.databind.ObjectMapper;

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
    
    public TransactionServiceImpl(
        TransactionRepository transactionRepository,
        MessagePublisher transactionMessagePublisher,
        AuthorizerClient authorizerClient
    ) {
        this.transactionRepository = transactionRepository;
        this.transactionMessagePublisher = transactionMessagePublisher;
        this.authorizerClient = authorizerClient;
    }

    @Override
    public void create(TransactionDTOIn dto) {
        //TODO: validate balance
        //TODO: validate if senderAccountNumber is different from receiverAccountNumber
        //TODO: validate if receiverAccountNumber exists

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
