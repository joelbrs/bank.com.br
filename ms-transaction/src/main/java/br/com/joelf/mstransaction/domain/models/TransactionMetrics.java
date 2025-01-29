package br.com.joelf.mstransaction.domain.models;

import java.math.BigDecimal;

public record TransactionMetrics(
    BigDecimal sent,
    BigDecimal received,
    BigDecimal internal,
    Integer month
) {}
