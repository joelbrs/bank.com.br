package br.com.joelf.mstransaction.application.ports;

public interface TokenHandler<T> {
    String generateToken(String issuer, String subject, T claims);
    boolean validateToken(String token);
}
