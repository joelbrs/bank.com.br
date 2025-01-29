package br.com.joelf.mstransaction.infrastructure.database.mapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.enums.TransactionStatus;
import br.com.joelf.mstransaction.domain.models.enums.TransactionType;

public class TransactionRowMapper implements RowMapper<Transaction> {

    @Override
    public Transaction mapRow(ResultSet rs, int rowNum) throws SQLException {
        UUID id = rs.getObject("id", UUID.class);
        BigDecimal amount = rs.getBigDecimal("amount");
        String senderAccountNumber = rs.getString("sender_account_number");
        String receiverAccountNumber = rs.getString("receiver_account_number");
        String description = rs.getString("description");
        LocalDateTime createdAt = rs.getObject("created_at", LocalDateTime.class);
        LocalDateTime updatedAt = rs.getObject("updated_at", LocalDateTime.class);
        TransactionStatus status = TransactionStatus.valueOf(rs.getString("status"));
        TransactionType type = TransactionType.valueOf(rs.getString("type"));

        return new Transaction(
            id, senderAccountNumber, receiverAccountNumber, amount, description, createdAt, updatedAt, status, type
        );
    }   
}
