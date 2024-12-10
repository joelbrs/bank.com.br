package br.com.joelf.wstransaction.infraestructure.repositories.database.entities;

import br.com.joelf.wstransaction.domain.entities.TransactionStatusEnum;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Document(collection = "transaction")
public class TransactionMongoDB {

    @Id
    private Long id;
    private TransactionStatusEnum status;
    private String description;
    private BigDecimal amount;
    private String payerAccountIdentifier;
    private String receiverAccountIdentifier;
    private String idempotencyKey;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
