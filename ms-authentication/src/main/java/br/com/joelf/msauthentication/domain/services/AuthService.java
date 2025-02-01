package br.com.joelf.msauthentication.domain.services;

import br.com.joelf.msauthentication.domain.entities.Token;
import br.com.joelf.msauthentication.domain.entities.User;

public interface AuthService {
    Token getToken(String username, String password);
    void createUser(User user);
}
