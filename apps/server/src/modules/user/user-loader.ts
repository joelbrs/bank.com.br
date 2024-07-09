import { createLoader } from "@entria/graphql-mongo-helpers";
import { registerLoader } from "../loader";
import { UserModel } from "./user-model";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: UserModel,
  loaderName: "UserLoader",
});

export const UserLoader = {
  User: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};

registerLoader("UserLoader", getLoader);
