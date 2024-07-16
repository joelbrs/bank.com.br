import { ZodErrorMap, ZodIssueCode, z } from "zod";

const errorMap: ZodErrorMap = (issue, _ctx) => {
  let message: string = "";
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      message = "Campo Obrigatório.";
      break;
    case ZodIssueCode.invalid_string:
      if (issue.validation !== "regex") {
        message = `'${issue.validation}' inválido.`;
      } else {
        message = "Inválido.";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "string")
        message = `O campo deverá conter ${
          issue.exact
            ? "exatamente"
            : issue.inclusive
              ? `no mínimo`
              : `no máximo`
        } ${issue.minimum} caracter(es)`;
      else if (issue.type === "number")
        message = `O número deverá ser ${
          issue.exact
            ? `exatamente igual à `
            : issue.inclusive
              ? `maior ou igual à `
              : `maior que `
        }${issue.minimum}`;
      break;
    case ZodIssueCode.too_big:
      message = "Inválido.";
      break;
    default:
      message = _ctx.defaultError;
  }
  return { message };
};

z.setErrorMap(errorMap);

export { z };
