import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("clients", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("invoices", (table) => {
    table.increments("id").primary();
    table.integer("client_id").notNullable();
    table.decimal("amount").notNullable();
    table.decimal("tax_rate").notNullable();
    table.string("status").defaultTo("Unpaid");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table
      .foreign("client_id")
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("invoices");
  await knex.schema.dropTableIfExists("clients");
}
