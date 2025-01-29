package br.com.joelf.mstransaction.application.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import br.com.joelf.mstransaction.infrastructure.async.MessagePublisher;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class TransactionServiceImpl implements TransactionService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final TransactionRepository transactionRepository;
    private final MessagePublisher messagePublisher;
    
    public TransactionServiceImpl(
        TransactionRepository transactionRepository,
        MessagePublisher messagePublisher
    ) {
        this.transactionRepository = transactionRepository;
        this.messagePublisher = messagePublisher;
    }

    @Override
    public void create(TransactionDTOIn dto) {
        //TODO: validate balance
        //TODO: validate if senderAccountNumber is different from receiverAccountNumber
        //TODO: validate if receiverAccountNumber exists

        Transaction transaction = MAPPER.convertValue(dto, Transaction.class);
        transaction = transactionRepository.save(transaction);
        
        try {
            messagePublisher.handleMessage(MAPPER.writeValueAsString(transaction));
        } catch (Exception e) {
            // TODO: handle it
        }
    }
}
