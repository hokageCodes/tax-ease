import type { Knex } from "knex";
import path from "path";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "../../data/invoices.db"),
    },
    migrations: {
      directory: path.join(__dirname, "./migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(__dirname, "./seeds"),
      extension: "ts",
    },
    useNullAsDefault: true,
  },
};

export default config;
