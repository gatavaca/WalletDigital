// ── 1. CONSTANTES: claves de almacenamiento en localStorage ──
const BALANCE_KEY = 'walletBalance';
const TRANSACTIONS_KEY = 'walletTransactions';

// ── 2. FUNCIÓN: Obtener saldo actual ──────────────────────
/**
 * Devuelve el saldo actual guardado en localStorage.
 * Si no existe, inicializa en 150000.
 * @returns {number} Saldo actual
 */
function getBalance() {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored !== null ? parseFloat(stored) : 150000;
}

// ── 3. FUNCIÓN: Guardar saldo ─────────────────────────────
/**
 * Persiste el saldo en localStorage.
 * @param {number} amount - Nuevo saldo a guardar
 */
function saveBalance(amount) {
  localStorage.setItem(BALANCE_KEY, amount.toFixed(2));
}

// ── FUNCIÓN AUXILIAR: Guardar transacción en el historial ──
function saveTransaction(description, amount, type) {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  const transactions = stored ? JSON.parse(stored) : getInitialTransactions();
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' ' + now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  transactions.unshift({
    date: dateStr,
    description: description,
    amount: amount,
    type: type
  });
  
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

function getInitialTransactions() {
  return [
    { date: "02/06/2026 18:42", description: "Compra en línea", amount: -5000, type: "withdrawal" },
    { date: "31/05/2026 15:43", description: "Transferencia recibida", amount: 20000, type: "deposit" },
    { date: "20/05/2026 10:18", description: "Compra en línea", amount: -6990, type: "withdrawal" },
    { date: "18/05/2026 16:02", description: "Transferencia a otro banco", amount: -29990, type: "withdrawal" },
    { date: "15/05/2026 20:38", description: "Compra en línea", amount: -59990, type: "withdrawal" }
  ];
}

// ── 4. FUNCIÓN: Depositar monto ───────────────────────────
/**
 * Suma el monto depositado al saldo actual y lo guarda.
 * @param {number} amount - Monto a depositar (debe ser > 0)
 * @returns {{ success: boolean, newBalance: number, message: string }}
 */
function deposit(amount) {
  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      newBalance: getBalance(),
      message: 'El monto debe ser un número mayor a cero.'
    };
  }

  const currentBalance = getBalance();
  const newBalance = currentBalance + amount;
  saveBalance(newBalance);
  
  // Guardamos la transacción en el historial
  saveTransaction('Depósito de fondos', amount, 'deposit');

  return {
    success: true,
    newBalance: newBalance,
    message: `Depósito exitoso. Nuevo saldo: $${formatCurrency(newBalance)}`
  };
}

// ── 5. FUNCIÓN: Formatear moneda ──────────────────────────
/**
 * Formatea un número como moneda con separadores de miles.
 * @param {number} amount
 * @returns {string} Ejemplo: "1.500,00"
 */
function formatCurrency(amount) {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ── 6. FUNCIÓN: Mostrar feedback al usuario ───────────────
/**
 * Muestra un mensaje de éxito o error en el elemento #depositFeedback.
 * @param {string} message - Texto a mostrar
 * @param {'success'|'error'} type - Tipo de alerta
 */
function showFeedback(message, type) {
  const feedback = document.getElementById('depositFeedback');
  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = `deposit-feedback ${type === 'success' ? 'feedback-success' : 'feedback-error'}`;
  feedback.style.display = 'block';

  // Ocultar automáticamente luego de 4 segundos
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 4000);
}

// ── 7. FUNCIÓN: Actualizar el display del saldo actual ────
/**
 * Actualiza el elemento #currentBalance en la pantalla
 * con el saldo almacenado.
 */
function updateBalanceDisplay() {
  const displayEl = document.getElementById('currentBalance');
  if (displayEl) {
    displayEl.textContent = `$${formatCurrency(getBalance())}`;
  }
}

// ── 8. EVENTO PRINCIPAL: Submit del formulario ────────────
const depositForm = document.getElementById('depositForm');

if (depositForm) {
  depositForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitamos la redirección nativa

    const input = document.getElementById('depositAmount');
    const amount = parseFloat(input.value);

    const result = deposit(amount);

    if (result.success) {
      // 1. Mostrar alerta nativa de JavaScript
      alert(`¡Depósito Exitoso!\n\nHas depositado: $${formatCurrency(amount)}\nTu nuevo saldo es: $${formatCurrency(result.newBalance)}`);
      
      // 2. Actualizar interfaz y feedback visual en el HTML
      showFeedback(result.message, 'success');
      updateBalanceDisplay();
      input.value = ''; // Limpiamos el campo
    } else {
      alert(`Error: ${result.message}`);
      showFeedback(result.message, 'error');
    }
  });
}

// ── 9. Al cargar la página, mostramos el saldo actual ─────
document.addEventListener('DOMContentLoaded', () => {
  updateBalanceDisplay();
});
