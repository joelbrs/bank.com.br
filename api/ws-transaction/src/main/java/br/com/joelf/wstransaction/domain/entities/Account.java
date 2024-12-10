package br.com.joelf.wstransaction.domain.entities;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class Account {

    private Long id;
    private String accountNumber;
    private String userTaxId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
