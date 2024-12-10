package br.com.joelf.wstransaction.infraestructure.repositories.customs.impl;

import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import br.com.joelf.wstransaction.infraestructure.repositories.customs.TransactionCustomRepository;
import br.com.joelf.wstransaction.infraestructure.repositories.customs.models.Balance;
import br.com.joelf.wstransaction.infraestructure.repositories.entities.TransactionMongoDB;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@AllArgsConstructor
@Repository
public class TransactionCustomRepositoryImpl implements TransactionCustomRepository {

    private final MongoTemplate template;

    @Override
    public BigDecimal getBalance(String accountIdentifier) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(
                        new Criteria().orOperator(
                                Criteria.where("payerAccountIdentifier").is(accountIdentifier),
                                Criteria.where("receiverAccountIdentifier").is(accountIdentifier)
                        ).andOperator(
                                Criteria.where("status").is(TransactionStatusEnum.SUCCESS.getDescription())
                        )
                ),
                Aggregation.project()
                        .and("amount")
                        .multiply(
                                ConditionalOperators.when("payerAccountIdentifier").then(-1).otherwise(1)
                        ).as("adjustedAmount"),
                Aggregation.group()
                        .sum("adjustedAmount")
                        .as("balance")
        );

        AggregationResults<Balance> result =
                template.aggregate(aggregation, TransactionMongoDB.class, Balance.class);
        return result.getUniqueMappedResult() != null ? result.getUniqueMappedResult().getBalance() : BigDecimal.ZERO;
    }
}
