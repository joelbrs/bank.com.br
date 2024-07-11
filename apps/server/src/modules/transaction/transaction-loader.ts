import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../loader";
import { TransactionModel } from "./transaction-model";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: TransactionModel,
  loaderName: "TransactionLoader",
});

export const TransactionLoader = {
  Transaction: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};

registerLoader("TransactionLoader", getLoader);
