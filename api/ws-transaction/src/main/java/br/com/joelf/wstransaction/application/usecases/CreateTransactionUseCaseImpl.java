package br.com.joelf.wstransaction.application.usecases;

import br.com.joelf.wstransaction.application.dataprovider.PublisherDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.TransactionDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.exceptions.PublisherDataProviderException;
import br.com.joelf.wstransaction.domain.dtos.TransactionRequest;
import br.com.joelf.wstransaction.domain.entities.Transaction;
import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import br.com.joelf.wstransaction.domain.usecases.CreateTransactionUseCase;
import br.com.joelf.wstransaction.domain.usecases.exceptions.CreateTransactionUseCaseException;
import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import br.com.joelf.wstransaction.domain.usecases.validations.ValidationException;
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
        try {
            validation.validate(request);

            Transaction result = transactionDataProvider.insert(buildTransaction(request));
            Thread.startVirtualThread(() ->
                    publisherDataProvider.publishTransaction(result)
            );
        } catch (ValidationException e) {
            throw new CreateTransactionUseCaseException(e.getMessage());
        }
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
