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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

// <!-- Script para la transición de redireccionamiento-->
    document.getElementById("botondedeposito").addEventListener("click", redireccionarA);
    document.getElementById("botondeenvio").addEventListener("click", redireccionarA);
    document.getElementById("botondehistorial").addEventListener("click", redireccionarA);

    function redireccionarA(event) {
      event.preventDefault(); // Evita que se navegue de inmediato

      const id = event.currentTarget.id;
      let mensaje = "";
      let url = "";

      if (id === "botondedeposito") {
        mensaje = "Redireccionando a depósito";
        url = "deposit.html";
      } else if (id === "botondeenvio") {
        mensaje = "Redireccionando a envío";
        url = "sendmoney.html";
      } else if (id === "botondehistorial") {
        mensaje = "Redireccionando a historial...";
        url = "transactions.html";
      }

      // Ejecutamos la acción si se encontró una URL válida
      if (url !== "") {
        alert(mensaje);
        window.location.href = url;
      }
    }