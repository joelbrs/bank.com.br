CREATE TABLE IF NOT EXISTS tb_conta (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,  
    user_tax_id VARCHAR(20) NOT NULL,            
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    status VARCHAR(10) CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',  
    CONSTRAINT account_number_unique UNIQUE (account_number)  
);

CREATE TABLE IF NOT EXISTS tb_transacao (
    id SERIAL PRIMARY KEY,
    sender_account_number VARCHAR(20) NOT NULL,  
    receiver_account_number VARCHAR(20) NOT NULL,  
    amount DECIMAL(15, 2) NOT NULL,               
    description TEXT,                             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    idempotent_key VARCHAR(255) NOT NULL UNIQUE,   
    status VARCHAR(10) CHECK (status IN ('PENDING', 'COMPLETED', 'ERROR')) DEFAULT 'PENDING',  
    type VARCHAR(10) CHECK (type IN ('CREDIT', 'DEBIT')) NOT NULL,  
    
    CONSTRAINT fk_sender_account FOREIGN KEY (sender_account_number) REFERENCES tb_conta(account_number) ON DELETE CASCADE,
    CONSTRAINT fk_receiver_account FOREIGN KEY (receiver_account_number) REFERENCES tb_conta(account_number) ON DELETE CASCADE
);


CREATE INDEX IF NOT EXISTS idx_transacao_sender_account_number ON tb_transacao(sender_account_number);
CREATE INDEX IF NOT EXISTS idx_transacao_receiver_account_number ON tb_transacao(receiver_account_number);
CREATE INDEX IF NOT EXISTS idx_transacao_status ON tb_transacao(status);
CREATE INDEX IF NOT EXISTS idx_transacao_type ON tb_transacao(type);
