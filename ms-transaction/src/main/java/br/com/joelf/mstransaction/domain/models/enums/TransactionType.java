package br.com.joelf.mstransaction.domain.models.enums;

public enum TransactionType {
    CREDIT("CREDIT"),
    DEBIT("DEBIT");

    private final String type;

    TransactionType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
