const appState = {
  clients: [],
  invoices: [],
  currentPage: 1,
  perPage: 5,

  setClients(clients) {
    this.clients = clients;
  },

  setInvoices(invoices) {
    this.invoices = invoices;
    this.currentPage = 1;
  },

  totalPages() {
    return Math.max(1, Math.ceil(this.invoices.length / this.perPage));
  },

  currentPageInvoices() {
    const start = (this.currentPage - 1) * this.perPage;
    return this.invoices.slice(start, start + this.perPage);
  },
};
