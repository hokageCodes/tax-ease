const API_BASE = "http://localhost:3001/api";

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

const API = {
  getClients() {
    return fetchAPI("/clients");
  },

  getInvoiceSummary() {
    return fetchAPI("/invoices/summary");
  },

  createInvoice(data) {
    return fetchAPI("/invoices", { method: "POST", body: JSON.stringify(data) });
  },

  updateInvoiceStatus(id, status) {
    return fetchAPI(`/invoices/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
  },

  deleteInvoice(id) {
    return fetchAPI(`/invoices/${id}`, { method: "DELETE" });
  },
};
