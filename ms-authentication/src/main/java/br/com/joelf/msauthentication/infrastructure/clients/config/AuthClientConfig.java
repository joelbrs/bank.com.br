package br.com.joelf.msauthentication.infrastructure.clients.config;

import org.springframework.beans.factory.ObjectFactory;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.Logger;
import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;

@Configuration
public class AuthClientConfig {

    @Bean
    Encoder encoder(
        ObjectFactory<HttpMessageConverters> converters
    ) {
        return new SpringFormEncoder(new SpringEncoder(converters));
    }

    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
