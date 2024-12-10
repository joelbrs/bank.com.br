package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.infraestructure.repositories.database.TransactionMongoDBRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.database.entities.TransactionMongoDB;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
public class TransactionDataProviderImpl implements TransactionDataProvider {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final TransactionMongoDBRepository repository;

    @Override
    public Transaction insert(Transaction transaction) {
        TransactionMongoDB transactionMongoDB = MAPPER.convertValue(transaction, TransactionMongoDB.class);
        return MAPPER.convertValue(repository.save(transactionMongoDB), Transaction.class);
    }

    @Override
    public void update(Transaction transaction) {
        this.insert(transaction);
    }

    @Override
    public BigDecimal getBalance(String accountIdetifier) {
        return repository.getBalance(accountIdetifier);
    }
}
