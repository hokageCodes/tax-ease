import { Router, Request, Response } from "express";
import { db } from "../server";
import { validateCreateInvoice } from "../middleware/validation";
import { Invoice, InvoiceSummary } from "../types";

const router = Router();

router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const invoiceSummary: InvoiceSummary[] = await db("invoices")
      .join("clients", "invoices.client_id", "clients.id")
      .select(
        "invoices.id",
        "clients.name as client_name",
        "invoices.amount",
        "invoices.tax_rate",
        "invoices.status",
        "invoices.created_at",
        db.raw("ROUND(invoices.amount * invoices.tax_rate / 100, 2) as tax_owed")
      )
      .orderBy("invoices.created_at", "desc");

    res.json(invoiceSummary);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch invoice summary", details: error.message });
  }
});

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

router.patch("/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Paid", "Unpaid"].includes(status)) {
    res.status(400).json({ error: "Status must be 'Paid' or 'Unpaid'" });
    return;
  }

  try {
    const invoice = await db("invoices").where("id", id).first();
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    await db("invoices").where("id", id).update({ status });
    const updated = await db("invoices").where("id", id).first();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update status", details: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const invoice = await db("invoices").where("id", id).first();
    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    await db("invoices").where("id", id).del();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete invoice", details: error.message });
  }
});

export default router;
