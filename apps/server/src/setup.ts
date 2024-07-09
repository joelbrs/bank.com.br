import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import Router from "koa-router";
import { contextMiddleware } from "./middlewares";

export const setup = () => {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());
  app.use(cors({ credentials: true }));

  app.use(contextMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
