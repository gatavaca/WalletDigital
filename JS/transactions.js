// ============================================================
// transactions.js — Carga dinámica de transacciones
// ============================================================

const TRANSACTIONS_KEY = 'walletTransactions';

function getInitialTransactions() {
  return [
    { date: "02/06/2026 18:42", description: "Compra en línea", amount: -5000, type: "withdrawal" },
    { date: "31/05/2026 15:43", description: "Transferencia recibida", amount: 20000, type: "deposit" },
    { date: "20/05/2026 10:18", description: "Compra en línea", amount: -6990, type: "withdrawal" },
    { date: "18/05/2026 16:02", description: "Transferencia a otro banco", amount: -29990, type: "withdrawal" },
    { date: "15/05/2026 20:38", description: "Compra en línea", amount: -59990, type: "withdrawal" }
  ];
}

function getTransactions() {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  return stored ? JSON.parse(stored) : getInitialTransactions();
}

function formatCurrency(amount) {
  const absoluteAmount = Math.abs(amount);
  return absoluteAmount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderTransactions() {
  const tbody = document.getElementById('transactionsTableBody');
  if (!tbody) return;

  const transactions = getTransactions();
  tbody.innerHTML = ''; // Limpiar el contenido estático anterior

  if (transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">No hay movimientos registrados.</td></tr>`;
    return;
  }

  transactions.forEach(t => {
    const row = document.createElement('tr');
    
    // Formatear el monto con signo y color
    const isNegative = t.amount < 0 || t.type === 'withdrawal';
    const sign = isNegative ? '-' : '+';
    const textClass = isNegative ? 'text-danger' : 'text-success';
    
    row.innerHTML = `
      <td><small class="text-white-50">${t.date}</small></td>
      <td>${t.description}</td>
      <td class="text-end ${textClass} fw-bold badge-amount">${sign}$${formatCurrency(t.amount)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Cargar la lista al iniciar
document.addEventListener('DOMContentLoaded', () => {
  renderTransactions();
});
