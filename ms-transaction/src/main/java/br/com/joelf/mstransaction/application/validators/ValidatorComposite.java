package br.com.joelf.mstransaction.application.validators;

public class ValidatorComposite<T> implements Validator<T> {

    private final Validator<T>[] validators;

    @SafeVarargs
    public ValidatorComposite(Validator<T>... validators) {
        this.validators = validators;
    }

    @Override
    public Throwable validate(T object) {
        for (Validator<T> validator : validators) {
            Throwable error = validator.validate(object);
            if (error != null) {
                return error;
            }
        }
        return null;
    }
}
