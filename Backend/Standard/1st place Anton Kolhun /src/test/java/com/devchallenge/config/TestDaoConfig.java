package com.devchallenge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.io.IOException;

import static java.lang.String.format;

public class TestDaoConfig {

    @Bean
    public PostgresLauncher postgresLauncher() throws IOException {
        return new PostgresLauncher("test-db");
    }

    @Bean
    public DataSource dataSource(PostgresLauncher postgresDb) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(format("jdbc:postgresql://%s:%s/%s",
                postgresDb.getHost(),
                postgresDb.getPort(),
                postgresDb.getDbName()
        ));
        return dataSource;
    }


}
