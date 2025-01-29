package br.com.joelf.mstransaction.infrastructure.async.exceptions;

public class UnprocessableEntityMessage extends RuntimeException {
    public UnprocessableEntityMessage(String message) {
        super(message);
    }
}
