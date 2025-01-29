package br.com.joelf.mstransaction.application.validators;

public interface Validator<T> {
    Throwable validate(T object);
}
