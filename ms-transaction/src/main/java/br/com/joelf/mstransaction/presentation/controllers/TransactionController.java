package br.com.joelf.mstransaction.presentation.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.joelf.mstransaction.domain.dtos.IdempotencyKeyDTOIn;
import br.com.joelf.mstransaction.domain.dtos.TransactionDTOIn;
import br.com.joelf.mstransaction.domain.services.TransactionService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
    
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid TransactionDTOIn dto) {
        transactionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/idempotency-key")
    public ResponseEntity<String> generateIdempotencyKey(@RequestBody @Valid IdempotencyKeyDTOIn dto) {
        return ResponseEntity.ok(transactionService.generateIdempotencyKey(dto));
    }

    @GetMapping("/metrics/{accountNumber}")
    public ResponseEntity<?> getMetricsByAccountNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(transactionService.getMetricsByAccountNumber(accountNumber));
    }
}
