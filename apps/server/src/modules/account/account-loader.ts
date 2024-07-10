import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../loader";
import { AccountModel } from "./account-model";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: AccountModel,
  loaderName: "AccountLoader",
});

export const AccountLoader = {
  Account: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};

registerLoader("AccountLoader", getLoader);
