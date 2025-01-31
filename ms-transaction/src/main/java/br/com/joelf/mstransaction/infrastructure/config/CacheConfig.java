package br.com.joelf.mstransaction.infrastructure.config;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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

    private static final String TRANSACTION_METRICS_SUFFIX = "/metrics";

    public static String metricsKey(String accountNumber) {
        return accountNumber + TRANSACTION_METRICS_SUFFIX;
    }
    
    @Bean
    public RedisTemplate<UUID, Transaction> redisTemplateTransaction(RedisConnectionFactory connectionFactory) {
        RedisTemplate<UUID, Transaction> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new Jackson2JsonRedisSerializer<>(UUID.class));
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        return template;
    }

    @Bean
    public RedisTemplate<String, List<TransactionMetrics>> redisTemplateMetrics(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, List<TransactionMetrics>> template = new RedisTemplate<>();
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(List.class));
        
        configureRedisTemplate(template, connectionFactory);

        return template;
    }

        
    @Bean
    public RedisTemplate<String, UUID> redisTemplateIdempotencyKey(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, UUID> template = new RedisTemplate<>();
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(UUID.class));

        configureRedisTemplate(template, connectionFactory);

        return template;
    }
        
    @Bean
    public RedisTemplate<String, BigDecimal> redisTemplateBalance(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, BigDecimal> template = new RedisTemplate<>();
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        configureRedisTemplate(template, connectionFactory);

        return template;
    }

    @Bean
    public CacheRepository<UUID, Transaction> cacheRepositoryTransaction(
        RedisTemplate<UUID, Transaction> redisTemplate
    ) {
        return new CacheRepositoryImpl<>(redisTemplate);
    }

    @Bean
    public CacheRepository<String, List<TransactionMetrics>> cacheRepositoryMetrics(
        RedisTemplate<String, List<TransactionMetrics>> redisTemplate
    ) {
        return new CacheRepositoryImpl<>(redisTemplate);
    }

    @Bean
    public CacheRepository<String, UUID> cacheRepositoryIdempotencyKey(
        RedisTemplate<String, UUID> redisTemplate
    ) {
        return new CacheRepositoryImpl<>(redisTemplate);
    }

    @Bean
    public CacheRepository<String, BigDecimal> cacheRepositoryBalance(
        RedisTemplate<String, BigDecimal> redisTemplate
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
