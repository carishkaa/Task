import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import knex, { Knex } from "knex";

export const plugin: FastifyPluginAsync = async (app) => {
  const client = knex({
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  });

  app.decorate("db", client);

  app.addHook('onClose', async () => {
    client.destroy()
  })
};

declare module "fastify" {
  export interface FastifyInstance {
    db: Knex<any, unknown[]>;
  }
}

export default fp(plugin);
