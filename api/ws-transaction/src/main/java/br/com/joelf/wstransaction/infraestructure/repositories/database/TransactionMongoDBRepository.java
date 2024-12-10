package br.com.joelf.wstransaction.infraestructure.repositories.database;

import br.com.joelf.wstransaction.infraestructure.repositories.database.customs.TransactionCustomRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.database.entities.TransactionMongoDB;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionMongoDBRepository extends MongoRepository<TransactionMongoDB, Long>, TransactionCustomRepository {
}
