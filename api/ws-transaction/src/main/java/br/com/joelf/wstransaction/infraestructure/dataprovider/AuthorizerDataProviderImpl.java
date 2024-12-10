package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.AuthorizerDataProvider;
import br.com.joelf.wstransaction.application.dataprovider.exceptions.AuthorizerDataProviderException;
import br.com.joelf.wstransaction.infraestructure.repositories.AuthorizerClient;
import feign.FeignException;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthorizerDataProviderImpl implements AuthorizerDataProvider {

    private final AuthorizerClient authorizerClient;

    @Override
    public void authorize() throws AuthorizerDataProviderException {
        try {
            authorizerClient.authorize();
        } catch (FeignException e) {
            //TODO: retry mechanism

            throw new AuthorizerDataProviderException(e.getMessage());
        }
    }
}
