package br.com.joelf.mstransaction.domain.validators;

public interface Validator<T> {
    Throwable validate(T object);
}
