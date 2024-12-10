package br.com.joelf.wstransaction.domain.usecases.exceptions;

public class ProcessTransactionUseCaseException extends RuntimeException {
    public ProcessTransactionUseCaseException(String msg) {
        super(msg);
    }
}
