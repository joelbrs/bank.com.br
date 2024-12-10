package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.exceptions.AuthorizerDataProviderException;
import br.com.joelf.wstransaction.infraestructure.repositories.AuthorizerClient;
import feign.FeignException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthorizerDataProviderImpl implements AuthorizerDataProvider {

    private final AuthorizerClient authorizerClient;

    @CircuitBreaker(name = "authorizer")
    @Retry(name = "authorizer")
    @Override
    public void authorize() throws AuthorizerDataProviderException {
        try {
            authorizerClient.authorize();
        } catch (FeignException e) {
            throw new AuthorizerDataProviderException(e.getMessage());
        }
    }
}
