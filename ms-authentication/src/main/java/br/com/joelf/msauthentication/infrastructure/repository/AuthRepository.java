package br.com.joelf.msauthentication.infrastructure.repository;

import br.com.joelf.msauthentication.domain.entities.Token;
import br.com.joelf.msauthentication.domain.entities.User;

public interface AuthRepository {
    Token getToken(String username, String password);
    void createUser(User user);
}
