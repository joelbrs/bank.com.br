package br.com.joelf.wstransaction;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.retry.annotation.EnableRetry;

@EnableRetry
@EnableFeignClients
@EnableRabbit
@EnableMongoRepositories
@SpringBootApplication
public class WsTransactionApplication {

    public static void main(String[] args) {
        SpringApplication.run(WsTransactionApplication.class, args);
    }
}
