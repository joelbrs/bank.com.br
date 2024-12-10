package br.com.joelf.wstransaction.infraestructure.repositories;

import br.com.joelf.wstransaction.domain.entities.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountMongoDBRepository extends MongoRepository<Account, Long> {
}
