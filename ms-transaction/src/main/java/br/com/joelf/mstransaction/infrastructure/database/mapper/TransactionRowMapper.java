package br.com.joelf.mstransaction.infrastructure.database.mapper;

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
        Transaction transaction = new Transaction();
        transaction.setId(rs.getObject("id", UUID.class));
        transaction.setAmount(rs.getBigDecimal("amount"));
        transaction.setSenderAccountNumber(rs.getString("sender_account_number"));
        transaction.setReceiverAccountNumber(rs.getString("receiver_account_number"));
        transaction.setIdempotentKey(rs.getString("idempotent_key"));
        transaction.setDescription(rs.getString("description"));
        transaction.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        transaction.setUpdatedAt(rs.getObject("updated_at", LocalDateTime.class));
        transaction.setStatus(TransactionStatus.valueOf(rs.getString("status")));
        transaction.setType(TransactionType.valueOf(rs.getString("type")));
        
        return transaction;
    }   
}
