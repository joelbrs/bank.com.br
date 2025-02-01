package br.com.joelf.msauthentication.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.msauthentication.application.services.AuthServiceImpl;
import br.com.joelf.msauthentication.domain.services.AuthService;
import br.com.joelf.msauthentication.infrastructure.repository.AuthRepository;

@Configuration
public class ServiceConfig {
    
    @Bean
    AuthService authService(
        AuthRepository authRepository
    ) {
        return new AuthServiceImpl(authRepository);
    }
}
