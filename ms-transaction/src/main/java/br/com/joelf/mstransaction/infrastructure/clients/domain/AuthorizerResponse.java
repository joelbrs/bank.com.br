package br.com.joelf.mstransaction.infrastructure.clients.domain;

public record AuthorizerResponse(
    String status,
    AuthorizerData data
) {}
