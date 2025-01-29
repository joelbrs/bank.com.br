package br.com.joelf.mstransaction.infrastructure.validators;

import java.lang.reflect.Field;

import org.springframework.util.ReflectionUtils;

import br.com.joelf.mstransaction.application.annotations.FieldsComparison;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FieldsComparisonValidator implements ConstraintValidator<FieldsComparison, Object> {

    private String firstFieldName;
    private String secondFieldName;
    private FieldsComparison.ComparisonType comparisonType;

    @Override
    public void initialize(FieldsComparison constraintAnnotation) {
        this.firstFieldName = constraintAnnotation.firstField();
        this.secondFieldName = constraintAnnotation.secondField();
        this.comparisonType = constraintAnnotation.comparison();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            Field firstField = ReflectionUtils.findField(value.getClass(), firstFieldName);
            Field secondField = ReflectionUtils.findField(value.getClass(), secondFieldName);

            if (firstField == null || secondField == null) {
                return false;
            }

            ReflectionUtils.makeAccessible(firstField);
            ReflectionUtils.makeAccessible(secondField);

            Object firstFieldValue = ReflectionUtils.getField(firstField, value);
            Object secondFieldValue = ReflectionUtils.getField(secondField, value);
            
            if (comparisonType == FieldsComparison.ComparisonType.EQUALS) {
                return firstFieldValue.equals(secondFieldValue);
            } 
            return !firstFieldValue.equals(secondFieldValue);
        } catch (Exception e) {
            return false;
        }
    }
}
