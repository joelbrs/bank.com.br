package br.com.joelf.mstransaction.infrastructure.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class JDBCConfig {
    
    private final String jdbcDriver;
    private final String jdbcUrl;
    private final String jdbcUsername;
    private final String jdbcPassword;

    public JDBCConfig(
            @Value("${spring.datasource.driver-class-name}") String jdbcDriver,
            @Value("${spring.datasource.url}") String jdbcUrl,
            @Value("${spring.datasource.username}") String jdbcUsername,
            @Value("${spring.datasource.password}") String jdbcPassword
    ) {
        this.jdbcDriver = jdbcDriver;
        this.jdbcUrl = jdbcUrl;
        this.jdbcUsername = jdbcUsername;
        this.jdbcPassword = jdbcPassword;
    }

    @Bean
    public DataSource postgresDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(jdbcDriver);
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(jdbcUsername);
        dataSource.setPassword(jdbcPassword);

        return dataSource;
    }
}
