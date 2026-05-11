document.addEventListener("DOMContentLoaded", async () => {
  await loadClients();
  await loadInvoices();

  document.getElementById("create-invoice-form").addEventListener("submit", handleCreateInvoice);
});

async function loadClients() {
  try {
    const clients = await API.getClients();
    appState.setClients(clients);
    populateClientDropdown(clients);
  } catch {
    showFormMessage("Failed to load clients", false);
  }
}

async function loadInvoices() {
  try {
    const invoices = await API.getInvoiceSummary();
    appState.setInvoices(invoices);
    renderInvoiceSummary(invoices);
  } catch {
    showFormMessage("Failed to load invoices", false);
  }
}

async function handleCreateInvoice(e) {
  e.preventDefault();

  const clientId = parseInt(document.getElementById("client-select").value);
  const amount = parseFloat(document.getElementById("amount").value);
  const taxRate = parseFloat(document.getElementById("tax-rate").value);

  if (!clientId || !amount || isNaN(taxRate)) {
    showFormMessage("All fields are required", false);
    return;
  }

  try {
    const newInvoice = await API.createInvoice({ client_id: clientId, amount, tax_rate: taxRate });
    showFormMessage(`Invoice #${newInvoice.id} created successfully!`, true);
    clearForm();
    await loadInvoices();
  } catch (error) {
    showFormMessage(`Error: ${error.message}`, false);
  }
}

async function handleStatusToggle(invoiceId, newStatus) {
  try {
    await API.updateInvoiceStatus(invoiceId, newStatus);
    await loadInvoices();
  } catch {
    showFormMessage("Failed to update status", false);
  }
}
