import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("clients").del();

  await knex("clients").insert([
    {
      id: 1,
      name: "Acme Corporation",
      email: "accounting@acme.com",
    },
    {
      id: 2,
      name: "TechStart Inc",
      email: "finance@techstart.io",
    },
  ]);
}
