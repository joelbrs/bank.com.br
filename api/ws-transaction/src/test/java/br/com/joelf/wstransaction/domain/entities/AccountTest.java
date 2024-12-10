package br.com.joelf.wstransaction.domain.entities;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class AccountTest {

    @Test
    public void shouldSetAndGetFieldsCorrectlyIfAccountIsCreated() {
        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("123456789");
        account.setUserTaxId("123.456.789-00");
        LocalDateTime now = LocalDateTime.now();
        account.setCreatedAt(now);
        account.setUpdatedAt(now);

        assertEquals(1L, account.getId());
        assertEquals("123456789", account.getAccountNumber());
        assertEquals("123.456.789-00", account.getUserTaxId());
        assertEquals(now, account.getCreatedAt());
        assertEquals(now, account.getUpdatedAt());
    }

    @Test
    public void shouldInitializeAccountFieldsIfAccountIsCreatedWithDefaultConstructor() {
        Account account = new Account();

        assertNull(account.getId());
        assertNull(account.getAccountNumber());
        assertNull(account.getUserTaxId());
        assertNull(account.getCreatedAt());
        assertNull(account.getUpdatedAt());
    }
}
