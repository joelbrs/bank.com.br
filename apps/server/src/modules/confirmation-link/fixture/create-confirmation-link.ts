import { ConfirmationLink, ConfirmationLinkModel } from "../confirmation-link";
import { getCounter } from "../../../../test/counters";
import { randomUUID } from "crypto";

export const createConfirmationLink = async (
  args?: Pick<ConfirmationLink, "userTaxId">
) => {
  const i = getCounter("confirmation-link");

  return new ConfirmationLinkModel({
    code: `code#${i}`,
    userTaxId: args?.userTaxId || randomUUID(),
  }).save();
};
