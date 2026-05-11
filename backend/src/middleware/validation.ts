import { Request, Response, NextFunction } from "express";

export interface CreateInvoiceBody {
  client_id: number;
  amount: number;
  tax_rate: number;
}

export const validateCreateInvoice = (req: Request, res: Response, next: NextFunction): void => {
  const { client_id, amount, tax_rate }: CreateInvoiceBody = req.body;

  if (client_id === undefined || amount === undefined || tax_rate === undefined) {
    res.status(400).json({ error: "Missing required fields: client_id, amount, tax_rate" });
    return;
  }

  if (typeof client_id !== "number" || !Number.isInteger(client_id)) {
    res.status(400).json({ error: "client_id must be a whole number" });
    return;
  }

  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "amount must be a positive number" });
    return;
  }

  if (typeof tax_rate !== "number" || tax_rate < 0 || tax_rate > 100) {
    res.status(400).json({ error: "tax_rate must be between 0 and 100" });
    return;
  }

  next();
};
