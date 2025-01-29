package br.com.joelf.mstransaction.infrastructure.database.postgres;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import br.com.joelf.mstransaction.infrastructure.database.AccountRepository;

public class AccountRepositoryImpl implements AccountRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public AccountRepositoryImpl(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    @Override
    public boolean existsByAccountNumber(String accountNumber) {
        String query = "select exists(select 1 from tb_conta where account_number = :accountNumber)";

        SqlParameterSource parameters = new MapSqlParameterSource()
            .addValue("accountNumber", accountNumber);

        return namedParameterJdbcTemplate.queryForObject(query, parameters, Boolean.class);
    }
}
