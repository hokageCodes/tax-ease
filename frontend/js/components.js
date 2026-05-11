function renderInvoiceSummary(invoices) {
  const container = document.getElementById("invoice-summary");

  if (!invoices || invoices.length === 0) {
    container.innerHTML = '<p class="loading">No invoices yet. Create one to get started!</p>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Amount</th>
          <th>Tax Rate</th>
          <th>Tax Owed</th>
          <th>Status</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  invoices.forEach((invoice) => {
    const statusClass = invoice.status === "Paid" ? "paid" : "unpaid";
    const createdDate = new Date(invoice.created_at).toLocaleDateString();
    const toggleLabel = invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid";
    const toggleStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";

    html += `
      <tr>
        <td>${invoice.client_name}</td>
        <td>$${Number(invoice.amount).toFixed(2)}</td>
        <td>${invoice.tax_rate}%</td>
        <td>$${Number(invoice.tax_owed).toFixed(2)}</td>
        <td><span class="status ${statusClass}">${invoice.status}</span></td>
        <td>${createdDate}</td>
        <td>
          <button class="btn-small" onclick="handleStatusToggle(${invoice.id}, '${toggleStatus}')">
            ${toggleLabel}
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
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
