export class BusinessRuleException extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "BusinessRuleException";
  }
}
