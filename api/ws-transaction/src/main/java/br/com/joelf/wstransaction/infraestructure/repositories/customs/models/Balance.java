package br.com.joelf.wstransaction.infraestructure.repositories.customs.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class Balance {
    private BigDecimal balance;
}
