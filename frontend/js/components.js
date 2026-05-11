const AVATAR_COLORS = ["#4a7c6f", "#7c6f4a", "#6f4a7c", "#4a6f7c", "#7c4a4a", "#4a7c4a"];

function fmt(value) {
  return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function renderInvoiceSummary(invoices) {
  const container = document.getElementById("invoice-summary");

  if (!invoices || invoices.length === 0) {
    container.innerHTML = '<p class="loading">No invoices yet. Click + New Invoice to get started.</p>';
    updateStats([]);
    return;
  }

  updateStats(invoices);

  const pageInvoices = appState.currentPageInvoices();

  let html = `
    <div class="invoice-list-header">
      <span></span>
      <span>Client</span>
      <span>Tax Owed</span>
      <span>Amount</span>
      <span>Status</span>
      <span>Actions</span>
    </div>
    <div class="invoice-list">
  `;

  pageInvoices.forEach((invoice) => {
    const initial = invoice.client_name.charAt(0).toUpperCase();
    const color = getAvatarColor(invoice.client_name);
    const date = new Date(invoice.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const statusClass = invoice.status === "Paid" ? "status-badge--paid" : "status-badge--unpaid";
    const toggleLabel = invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid";
    const toggleStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";

    html += `
      <div class="invoice-row">
        <div class="invoice-row__avatar" style="background:${color}">${initial}</div>
        <div class="invoice-row__info">
          <div class="invoice-row__client">${invoice.client_name}</div>
          <div class="invoice-row__meta">INV-${String(invoice.id).padStart(4, "0")} &bull; ${date}</div>
        </div>
        <span class="invoice-row__tax">Tax ${fmt(invoice.tax_owed)}</span>
        <span class="invoice-row__amount">${fmt(invoice.amount)}</span>
        <span class="status-badge ${statusClass}">${invoice.status}</span>
        <div class="invoice-row__actions">
          <button class="btn-toggle" onclick="handleStatusToggle(${invoice.id}, '${toggleStatus}')"><i class="fa-solid fa-rotate"></i> ${toggleLabel}</button>
          <button class="btn-toggle btn-delete" onclick="handleDeleteInvoice(${invoice.id})"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  html += renderPagination();

  container.innerHTML = html;
}

function renderPagination() {
  const total = appState.totalPages();
  const current = appState.currentPage;

  if (total <= 1) return "";

  let html = `<div class="pagination">`;

  html += `<button class="page-btn" onclick="goToPage(${current - 1})" ${current === 1 ? "disabled" : ""}>
    <i class="fa-solid fa-chevron-left"></i>
  </button>`;

  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === current ? "page-btn--active" : ""}" onclick="goToPage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" onclick="goToPage(${current + 1})" ${current === total ? "disabled" : ""}>
    <i class="fa-solid fa-chevron-right"></i>
  </button>`;

  html += `<span class="page-info">${current} of ${total} &bull; ${appState.invoices.length} invoices</span>`;
  html += `</div>`;

  return html;
}

function updateStats(invoices) {
  const unpaid = invoices.filter((i) => i.status === "Unpaid");
  const outstanding = unpaid.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalTax = invoices.reduce((sum, i) => sum + Number(i.tax_owed), 0);

  document.getElementById("stat-outstanding").textContent = fmt(outstanding);
  document.getElementById("stat-tax").textContent = fmt(totalTax);
}

function populateClientDropdown(clients) {
  const select = document.getElementById("client-select");
  clients.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
}

function showFormMessage(message, isSuccess = true) {
  const el = document.getElementById("form-message");
  el.textContent = message;
  el.className = `form-message ${isSuccess ? "success" : "error"}`;
  setTimeout(() => {
    el.textContent = "";
    el.className = "form-message";
  }, 3000);
}

function clearForm() {
  document.getElementById("create-invoice-form").reset();
}
