package br.com.joelf.mstransaction.domain.models.enums;

public enum TransactionStatus {
    PENDING("PENDING"),
    COMPLETED("COMPLETED"),
    ERROR("ERROR");

    private final String status;

    TransactionStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
