package br.com.joelf.wstransaction.application.dataprovider;

import br.com.joelf.wstransaction.domain.entities.Transaction;

public interface PublisherDataProvider {
    void publishTransaction(Transaction transaction);
}
