package br.com.joelf.mstransaction.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.mstransaction.application.ports.TokenHandler;
import br.com.joelf.mstransaction.infrastructure.adapters.TokenHandlerImpl;

@Configuration
public class AdapterConfig {
    
    @Bean
    public TokenHandler<Object> tokenHandler(
        @Value("${jwt.secret}") String jwtSecret, 
        @Value("${jwt.expiration}") Long jwtExpiration
    ) {
        return new TokenHandlerImpl(jwtSecret, jwtExpiration);
    }
}
