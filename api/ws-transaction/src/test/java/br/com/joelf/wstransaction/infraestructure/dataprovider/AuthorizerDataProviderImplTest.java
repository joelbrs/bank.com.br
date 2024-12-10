package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.application.dataprovider.exceptions.AuthorizerDataProviderException;
import br.com.joelf.wstransaction.infraestructure.repositories.https.AuthorizerClient;
import feign.FeignException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;

@ExtendWith(MockitoExtension.class)
public class AuthorizerDataProviderImplTest {

    @Mock
    private AuthorizerClient authorizerClient;

    @InjectMocks
    private AuthorizerDataProviderImpl authorizerDataProvider;

    @Test
    public void shouldThrowAuthorizerDataProviderExceptionIfFeignExceptionIsThrown() {
        doThrow(FeignException.BadGateway.class)
                .when(authorizerClient).authorize();

        assertThrows(AuthorizerDataProviderException.class, () -> {
            authorizerDataProvider.authorize();
        });
    }

    @Test
    public void shouldAuthorizeSuccessfullyIfNoExceptionIsThrown() throws AuthorizerDataProviderException {
        authorizerDataProvider.authorize();
    }
}