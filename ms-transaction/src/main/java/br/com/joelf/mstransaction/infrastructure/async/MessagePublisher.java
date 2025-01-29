package br.com.joelf.mstransaction.infrastructure.async;

import br.com.joelf.mstransaction.infrastructure.async.exceptions.UnprocessableEntityMessage;

public interface MessagePublisher {
    void handleMessage(String message) throws UnprocessableEntityMessage;
}
