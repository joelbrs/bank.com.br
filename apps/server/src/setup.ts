import Koa, { ParameterizedContext } from "koa";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import Router from "koa-router";
import { graphqlHTTP } from "koa-graphql";
import { getUserByContext } from "./authentication";
import { schema } from "./schema";
import { getContext } from "./get-context";

export const setup = () => {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());
  app.use(cors({ credentials: true }));

  router.all(
    "/graphql",
    graphqlHTTP(async (_, __, ctx: ParameterizedContext) => {
      const { user } = await getUserByContext(ctx);

      return {
        graphiql: true,
        schema,
        pretty: true,

        context: await getContext({
          ctx,
          user,
        }),
      };
    })
  );

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
