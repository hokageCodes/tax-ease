import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import knex from "knex";
import path from "path";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "../data/invoices.db"),
  },
  useNullAsDefault: true,
});

app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app, db };
