export interface Client {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  client_id: number;
  amount: number;
  tax_rate: number;
  status: "Paid" | "Unpaid";
  created_at: string;
}

export interface InvoiceSummary {
  id: number;
  client_name: string;
  amount: number;
  tax_rate: number;
  tax_owed: number;
  status: "Paid" | "Unpaid";
  created_at: string;
}
