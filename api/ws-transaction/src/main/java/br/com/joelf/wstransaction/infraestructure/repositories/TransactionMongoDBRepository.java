package br.com.joelf.wstransaction.infraestructure.repositories;

import br.com.joelf.wstransaction.infraestructure.repositories.customs.TransactionCustomRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.entities.TransactionMongoDB;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionMongoDBRepository extends MongoRepository<TransactionMongoDB, Long>, TransactionCustomRepository {
}
