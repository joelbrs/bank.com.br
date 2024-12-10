package br.com.joelf.wstransaction.domain.usecases.validations;

@FunctionalInterface
public interface Validation {
    void validate(Object object);
}
