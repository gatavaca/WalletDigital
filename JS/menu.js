// ============================================================
// menu.js — Carga del saldo en el Menú Principal
// ============================================================

const BALANCE_KEY = 'walletBalance';

function getBalance() {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored !== null ? parseFloat(stored) : 150000;
}

function formatCurrency(amount) {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function updateMenuBalance() {
  const balanceEl = document.getElementById('menuBalance');
  if (balanceEl) {
    balanceEl.textContent = `$${formatCurrency(getBalance())}`;
  }
}

// Cargar saldo al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  updateMenuBalance();
});
