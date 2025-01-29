package br.com.joelf.mstransaction.domain.models;

import java.time.LocalDateTime;

import br.com.joelf.mstransaction.domain.models.enums.AccountStatus;

public class Account {
    private String accountNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AccountStatus status;

    public Account() {
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }
}
