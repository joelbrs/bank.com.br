package br.com.joelf.mstransaction.infrastructure.database;

public interface CacheRepository<Key, Value> {
    Value get(Key key);
    void put(Key key, Value value);
    void delete(@SuppressWarnings("unchecked") Key ...keys);
}
