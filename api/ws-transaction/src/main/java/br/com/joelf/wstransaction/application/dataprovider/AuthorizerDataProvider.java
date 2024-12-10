package br.com.joelf.wstransaction.application.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.exceptions.AuthorizerDataProviderException;

public interface AuthorizerDataProvider {
    void authorize() throws AuthorizerDataProviderException;
}
