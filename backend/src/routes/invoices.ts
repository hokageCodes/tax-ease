import { Router, Request, Response } from "express";
import { db } from "../server";
import { validateCreateInvoice } from "../middleware/validation";
import { Invoice } from "../types";

const router = Router();

router.post("/", validateCreateInvoice, async (req: Request, res: Response) => {
  const { client_id, amount, tax_rate } = req.body;

  try {
    const clientExists = await db("clients").where("id", client_id).first();
    if (!clientExists) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const [invoiceId] = await db("invoices").insert({
      client_id,
      amount,
      tax_rate,
      status: "Unpaid",
    });

    const createdInvoice: Invoice = await db("invoices").where("id", invoiceId).first();
    res.status(201).json(createdInvoice);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create invoice", details: error.message });
  }
});

export default router;
