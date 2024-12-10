package br.com.joelf.wstransaction.application.usecases;

import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.exceptions.AuthorizerDataProviderException;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import br.com.joelf.wstransaction.domain.usecases.ProcessTransactionUseCase;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
public class ProcessTransactionUseCaseImpl implements ProcessTransactionUseCase {

    private final AuthorizerDataProvider authorizerDataProvider;
    private final TransactionDataProvider transactionDataProvider;

    @Transactional
    @Override
    public void execute(Transaction transaction) {
        try {
            authorizerDataProvider.authorize();
            transactionDataProvider.update(
                    buildTransaction(transaction, TransactionStatusEnum.SUCCESS)
            );

            //TODO: call notification system
        } catch (AuthorizerDataProviderException e) {
            // TODO: add exception treatments
        }
    }

    private Transaction buildTransaction(Transaction transaction, TransactionStatusEnum status) {
        transaction.setStatus(status);
        return transaction;
    }
}
