package br.com.joelf.wstransaction.application.usecases;

import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import br.com.joelf.wstransaction.domain.usecases.CreateTransactionUseCase;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
public class CreateTransactionUseCaseImpl implements CreateTransactionUseCase {

    private final Validation validation;

    private final TransactionDataProvider transactionDataProvider;
    private final PublisherDataProvider publisherDataProvider;

    @Transactional
    @Override
    public void execute(TransactionRequest request) {
        validation.validate(request);

        //TODO: add exception treatments
        Transaction result = transactionDataProvider.insert(buildTransaction(request));
        publisherDataProvider.publishTransaction(result);
    }

    private Transaction buildTransaction(TransactionRequest request) {
        return Transaction.builder()
                .status(TransactionStatusEnum.PENDING)
                .amount(request.getAmount())
                .description(request.getDescription())
                //TODO: add payerAccountIdentifier
                .receiverAccountIdentifier(request.getAccountIdentifier())
                .idempotencyKey(request.getIdempotencyKey())
                .build();
    }
}
