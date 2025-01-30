package br.com.joelf.mstransaction.infrastructure.database.redis;

import org.springframework.data.redis.core.RedisTemplate;

import br.com.joelf.mstransaction.infrastructure.database.CacheRepository;

public class CacheRepositoryImpl<Key, Value> implements CacheRepository<Key, Value> {
    private final RedisTemplate<Key, Value> redisTemplate;

    public CacheRepositoryImpl(RedisTemplate<Key, Value> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Value get(Key key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void put(Key key, Value value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public void delete(@SuppressWarnings("unchecked") Key ...keys) {
        for (Key key : keys) {
            redisTemplate.delete(key);
        }
    }
}
