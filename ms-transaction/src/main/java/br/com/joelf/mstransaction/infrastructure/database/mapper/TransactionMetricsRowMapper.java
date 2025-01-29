package br.com.joelf.mstransaction.infrastructure.database.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import br.com.joelf.mstransaction.domain.models.TransactionMetrics;

public class TransactionMetricsRowMapper implements RowMapper<TransactionMetrics> {

    @Override
    public TransactionMetrics mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new TransactionMetrics(
            rs.getBigDecimal("sent"),
            rs.getBigDecimal("received"),
            rs.getBigDecimal("internal"),
            rs.getInt("month")
        );
    }
}
