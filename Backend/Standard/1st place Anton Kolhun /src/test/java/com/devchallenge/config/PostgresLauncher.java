package com.devchallenge.config;

import ru.yandex.qatools.embed.postgresql.PostgresExecutable;
import ru.yandex.qatools.embed.postgresql.PostgresProcess;
import ru.yandex.qatools.embed.postgresql.PostgresStarter;
import ru.yandex.qatools.embed.postgresql.config.PostgresConfig;
import ru.yandex.qatools.embed.postgresql.distribution.Version;

import javax.annotation.PreDestroy;
import java.io.IOException;


public class PostgresLauncher {
    private final PostgresExecutable exec;
    private final PostgresProcess process;
    private final String databaseName;
    private final String host;
    private final int port;

    public PostgresLauncher(String databaseName) throws IOException {
        PostgresStarter<PostgresExecutable, PostgresProcess> runtime = PostgresStarter.getDefaultInstance();
        final PostgresConfig config = new PostgresConfig(Version.Main.V9_4, databaseName);
        this.databaseName = databaseName;
        this.host = config.net().host();
        this.port = config.net().port();
        this.exec = runtime.prepare(config);
        this.process = this.exec.start();
    }

    @PreDestroy
    public void close() {
        process.stop();
        exec.stop();
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    public String getDbName() {
        return databaseName;
    }
}
