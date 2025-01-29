package br.com.joelf.mstransaction.infrastructure.database.postgres;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.transaction.annotation.Transactional;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.TransactionMetrics;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;

public class TransactionRepositoryImpl implements TransactionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private final RowMapper<Transaction> transactionRowMapper;
    private final RowMapper<TransactionMetrics> transactionMetricsRowMapper;

    public TransactionRepositoryImpl(
        JdbcTemplate jdbcTemplate, 
        NamedParameterJdbcTemplate namedParameterJdbcTemplate,
        RowMapper<Transaction> transactionRowMapper,
        RowMapper<TransactionMetrics> transactionMetricsRowMapper
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.transactionRowMapper = transactionRowMapper;
        this.transactionMetricsRowMapper = transactionMetricsRowMapper;
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
    public Transaction save(Transaction transaction) {
        String query = """
                insert into tb_transacao (id, sender_account_number, receiver_account_number, amount, idempotent_key, description, type)
                    values (?, ?, ?, ?, ?, ?, ?);
            """;
        
        transaction.setId(UUID.randomUUID());

        jdbcTemplate.update(
            query, 
            transaction.getId(), 
            transaction.getSenderAccountNumber(), 
            transaction.getReceiverAccountNumber(), 
            transaction.getAmount(), 
            transaction.getIdempotentKey(),
            transaction.getDescription(), 
            transaction.getType().name()
        );

        return transaction;
    }

    @Override
    public UUID update(Transaction transaction) {
        String query = """
                update tb_transacao set status = ? where id = ?;
            """;

        jdbcTemplate.update(
            query, 
            transaction.getStatus().name(), 
            transaction.getId()
        );
        return transaction.getId();
    }

    @Override
    public BigDecimal getBalance(String accountNumber) {
        String query = """
                select sum(
                    case 
                        when sender_account_number = receiver_account_number then amount
                        when type = 'DEBIT' then -amount
                        else amount
                    end
                ) from tb_transacao 
                where (sender_account_number = :account_number or receiver_account_number = :account_number) and status = 'COMPLETED';
            """;

        SqlParameterSource parameters = new MapSqlParameterSource()
            .addValue("sender_account_number", accountNumber);

        return namedParameterJdbcTemplate.queryForObject(query, parameters, BigDecimal.class);
    }

    @Override
    public boolean existsByIdempotencyKey(String idempotencyKey) {
        String query = """
            select exists(select 1 from tb_transacao where idempotent_key = :idempotency_key) and status = 'COMPLETED' or status = 'PENDING';    
            """;

        SqlParameterSource parameters = new MapSqlParameterSource()
            .addValue("idempotency_key", idempotencyKey);
        return namedParameterJdbcTemplate.queryForObject(query, parameters, Boolean.class);
    }

    @Override
    public List<TransactionMetrics> getMetricsByAccountNumber(String accountNumber) {
        String query = """
                select extract(month from t.created_at) as month, 
                    sum(case when t.sender_account_number = :account_number and not t.receiver_account_number = :account_number then t.amount else 0 end) as sent,
                    sum(case when t.receiver_account_number = :account_number and not t.sender_account_number = :account_number then t.amount else 0 end) as received,
                    sum(case when t.sender_account_number = :account_number and t.receiver_account_number = :account_number then t.amount else 0 end) as internal

                from tb_transacao t where t.status = 'COMPLETED' and (t.sender_account_number = :account_number or t.receiver_account_number = :account_number)
                group by month
                order by month;
            """;

        SqlParameterSource parameters = new MapSqlParameterSource()
            .addValue("account_number", accountNumber);

        return namedParameterJdbcTemplate.query(query, parameters, transactionMetricsRowMapper);
    }
}
