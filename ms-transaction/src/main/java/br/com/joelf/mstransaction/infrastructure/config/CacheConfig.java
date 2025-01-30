package br.com.joelf.mstransaction.infrastructure.config;

import java.util.List;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import br.com.joelf.mstransaction.domain.models.Transaction;
import br.com.joelf.mstransaction.domain.models.TransactionMetrics;
import br.com.joelf.mstransaction.infrastructure.database.CacheRepository;
import br.com.joelf.mstransaction.infrastructure.database.redis.CacheRepositoryImpl;

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public RedisTemplate<String, Transaction> redisTemplateTransaction(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Transaction> template = new RedisTemplate<>();
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        configureRedisTemplate(template, connectionFactory);

        return template;
    }

    @Bean
    public RedisTemplate<String, TransactionMetrics> redisTemplateMetrics(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, TransactionMetrics> template = new RedisTemplate<>();
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(List.class));
        
        configureRedisTemplate(template, connectionFactory);

        return template;
    }

    @Bean
    public CacheRepository<String, Transaction> cacheRepositoryTransaction(
        RedisTemplate<String, Transaction> redisTemplate
    ) {
        return new CacheRepositoryImpl<>(redisTemplate);
    }

    @Bean
    public CacheRepository<String, List<TransactionMetrics>> cacheRepositoryMetrics(
        RedisTemplate<String, List<TransactionMetrics>> redisTemplate
    ) {
        return new CacheRepositoryImpl<>(redisTemplate);
    }

    private <K, V> void configureRedisTemplate(
        RedisTemplate<K, V> template, RedisConnectionFactory connectionFactory
    ) {
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
    }
}
