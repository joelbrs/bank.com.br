export class BusinessRuleException extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "BusinessRuleException";
  }
}

export class EntityNotFoundException extends Error {
  constructor(entityName: string) {
    super(`${entityName} não encontrado.`);
    this.name = "EntityNotFoundException";
  }
}

export class UnauthorizedException extends Error {
  constructor() {
    super("Acesso não autorizado.");
    this.name = "UnauthorizedException";
  }
}
