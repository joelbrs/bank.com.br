package br.com.joelf.wstransaction.application.usecases.validations;

import br.com.joelf.wstransaction.domain.usecases.validations.Validation;
import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class ValidationComposite implements Validation {

    private final List<Validation> validations;

    @Override
    public void validate(Object object) {
        for (Validation validation : validations) {
            validation.validate(object);
        }
    }
}
