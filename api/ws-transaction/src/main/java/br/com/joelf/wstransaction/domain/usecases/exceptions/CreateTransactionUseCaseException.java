package br.com.joelf.wstransaction.domain.usecases.exceptions;

public class CreateTransactionUseCaseException extends RuntimeException {
    public CreateTransactionUseCaseException(String msg) {
        super(msg);
    }
}
