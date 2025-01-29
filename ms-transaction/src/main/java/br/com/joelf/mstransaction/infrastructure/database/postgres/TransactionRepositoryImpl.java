package br.com.joelf.mstransaction.infrastructure.database.postgres;

import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.transaction.annotation.Transactional;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class TransactionRepositoryImpl implements TransactionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private final RowMapper<Transaction> transactionRowMapper;

    public TransactionRepositoryImpl(
        JdbcTemplate jdbcTemplate, 
        NamedParameterJdbcTemplate namedParameterJdbcTemplate,
        RowMapper<Transaction> transactionRowMapper
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.transactionRowMapper = transactionRowMapper;
    }

    @Override
    public Transaction findById(UUID id) {
        String query = """
                select * from tb_transacao where id = :id;   
            """;

        SqlParameterSource parameters = new MapSqlParameterSource()
            .addValue("id", id);

        try {
            return 
                namedParameterJdbcTemplate.queryForObject(query, parameters, transactionRowMapper);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public UUID save(Transaction transaction) {
        String query = """
                insert into tb_transacao (id, sender_account_number, receiver_account_number, amount, description, type)
                    values (?, ?, ?, ?, ?, ?);
            """;
        
        UUID id = UUID.randomUUID();

        jdbcTemplate.update(
            query, 
            id, 
            transaction.senderAccountNumber(), 
            transaction.receiverAccountNumber(), 
            transaction.amount(), 
            transaction.description(), 
            transaction.type().name()
        );

        return id;
    }
}
