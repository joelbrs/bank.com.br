package br.com.joelf.wstransaction.infraestructure.dataprovider;

import br.com.joelf.wstransaction.infraestructure.repositories.database.AccountMongoDBRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AccountDataProviderImplTest {

    @Mock
    private AccountMongoDBRepository repository;

    @InjectMocks
    private AccountDataProviderImpl accountDataProvider;

    @Test
    public void shouldReturnTrueIfAccountExists() {
        String accountNumber = "account123";
        when(repository.existsByAccountNumber(accountNumber)).thenReturn(true);

        boolean exists = accountDataProvider.existsByAccountIdentifier(accountNumber);

        assertTrue(exists);
    }

    @Test
    public void shouldReturnFalseIfAccountDoesNotExist() {
        String accountNumber = "account123";
        when(repository.existsByAccountNumber(accountNumber)).thenReturn(false);

        boolean exists = accountDataProvider.existsByAccountIdentifier(accountNumber);

        assertFalse(exists);
    }
}
