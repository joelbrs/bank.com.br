package br.com.joelf.msauthentication.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.joelf.msauthentication.infrastructure.clients.AuthClient;
import br.com.joelf.msauthentication.infrastructure.repository.AuthRepository;
import br.com.joelf.msauthentication.infrastructure.repository.impl.AuthRepositoryImpl;

@Configuration
@EnableFeignClients(basePackages = "br.com.joelf.msauthentication.infrastructure.clients")
public class RepositoryConfig {
    
    @Bean
    AuthRepository authRepository(
        @Value("${gateway.auth.realm}") String realm,
        @Value("${gateway.auth.client-id}") String clientId,
        @Value("${gateway.auth.client-secret}") String clientSecret,
        @Value("${gateway.auth.grant-type}") String grantType,
        @Value("${gateway.auth.admin.grant-type}") String adminGrantType,
        AuthClient authClient
    ) {
        return new AuthRepositoryImpl(
            realm,
            clientId,
            clientSecret,
            grantType,
            adminGrantType,
            authClient
        );
    }
}
