package br.com.joelf.wstransaction.domain.usecases.validations;

public class ValidationException extends RuntimeException {
    public ValidationException(String msg) {
        super(msg);
    }
}
