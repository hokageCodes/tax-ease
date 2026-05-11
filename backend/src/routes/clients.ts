import { Router, Request, Response } from "express";
import { db } from "../server";
import { Client } from "../types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const clients: Client[] = await db("clients").select("*");
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch clients", details: error.message });
  }
});

export default router;
