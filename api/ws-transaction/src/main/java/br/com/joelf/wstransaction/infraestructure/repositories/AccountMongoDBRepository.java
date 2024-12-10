package br.com.joelf.wstransaction.infraestructure.repositories;

import br.com.joelf.wstransaction.infraestructure.repositories.entities.AccountMongoDB;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountMongoDBRepository extends MongoRepository<AccountMongoDB, Long> {

    boolean existsByAccountNumber(String accountNumber);
}
