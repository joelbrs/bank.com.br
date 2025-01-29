package br.com.joelf.mstransaction.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.infrastructure.database.TransactionRepository;
import br.com.joelf.mstransaction.infrastructure.database.mapper.TransactionRowMapper;
import br.com.joelf.mstransaction.infrastructure.database.postgres.TransactionRepositoryImpl;

@Configuration
public class RepositoryConfig {

    @Bean
    public TransactionRepository transactionRepository(
        JdbcTemplate jdbcTemplate,
        NamedParameterJdbcTemplate namedParameterJdbcTemplate,
        RowMapper<Transaction> transactionRowMapper
    ) {
        return new TransactionRepositoryImpl(jdbcTemplate, namedParameterJdbcTemplate, transactionRowMapper);
    }
    
    @Bean
    public RowMapper<Transaction> transactionRowMapper() {
        return new TransactionRowMapper();
    }
}
