// ============================================================
// sendmoney.js — Gestión de envíos de dinero y saldo
// ============================================================

const BALANCE_KEY = 'walletBalance';
const TRANSACTIONS_KEY = 'walletTransactions';

// ── 1. OBTENER SALDO ────────────────────────────────────────
function getBalance() {
  const stored = localStorage.getItem(BALANCE_KEY);
  return stored !== null ? parseFloat(stored) : 150000;
}

// ── 2. GUARDAR SALDO ────────────────────────────────────────
function saveBalance(amount) {
  localStorage.setItem(BALANCE_KEY, Math.round(amount).toString());
}

// ── 3. GUARDAR TRANSACCIÓN EN HISTORIAL ─────────────────────
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
    amount: -Math.round(amount), // Se guarda negativo para egresos
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

// ── 4. FORMATEAR MONEDA ─────────────────────────────────────
function formatCurrency(amount) {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// ── 5. ACTUALIZAR VISTA DE SALDO ───────────────────────────
function updateBalanceDisplay() {
  const displayEl = document.getElementById('currentBalance');
  if (displayEl) {
    displayEl.textContent = `$${formatCurrency(getBalance())}`;
  }
}

// ── 6. GESTIÓN DINÁMICA DE CONTACTOS ────────────────────────
const CONTACTS_KEY = 'walletContacts';

function getInitialContacts() {
  return [
    { name: "Remigio Gómez", cbu: "123456789", alias: "dealer", bank: "Bancoestado" },
    { name: "Bessie Smiths", cbu: "987654321", alias: "minimarket", bank: "Banco Santander" }
  ];
}

function getContacts() {
  const stored = localStorage.getItem(CONTACTS_KEY);
  return stored ? JSON.parse(stored) : getInitialContacts();
}

function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function renderContacts() {
  const listEl = document.getElementById('contactList');
  if (!listEl) return;
  
  const contacts = getContacts();
  listEl.innerHTML = '';
  
  contacts.forEach((contact) => {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-custom';
    li.style.cursor = 'pointer';
    
    li.innerHTML = `
      <div class="contact-info">
        <span class="contact-name">${contact.name}</span>
        <span class="contact-details">CBU: ${contact.cbu} | Alias: ${contact.alias} | Banco: ${contact.bank}</span>
      </div>
    `;
    
    // Al hacer clic, seleccionar contacto e ingresar su nombre en el buscador
    li.addEventListener('click', () => {
      const allItems = listEl.querySelectorAll('.list-group-item-custom');
      allItems.forEach(el => el.classList.remove('active'));
      
      li.classList.add('active');
      
      const searchInput = document.getElementById('searchContact');
      if (searchInput) {
        searchInput.value = contact.name;
      }
    });
    
    listEl.appendChild(li);
  });
}

// ── 7. CONTROL DEL MODAL DE NUEVO CONTACTO ──────────────────
const addContactBtn = document.getElementById('addContactBtn');
const addContactModal = document.getElementById('addContactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addContactForm = document.getElementById('addContactForm');

if (addContactBtn && addContactModal) {
  addContactBtn.addEventListener('click', () => {
    addContactModal.classList.add('active');
  });
}

function closeModal() {
  if (addContactModal) {
    addContactModal.classList.remove('active');
  }
  if (addContactForm) {
    addContactForm.reset();
  }
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

// Cerrar haciendo clic fuera de la caja del modal (en la zona oscura)
if (addContactModal) {
  addContactModal.addEventListener('click', (event) => {
    if (event.target === addContactModal) {
      closeModal();
    }
  });
}

// Procesar el formulario del nuevo contacto
if (addContactForm) {
  addContactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const nameInput = document.getElementById('contactNameInput');
    const cbuInput = document.getElementById('contactCbuInput');
    const aliasInput = document.getElementById('contactAliasInput');
    const bankInput = document.getElementById('contactBankInput');
    
    const newContact = {
      name: nameInput.value.trim(),
      cbu: cbuInput.value.trim(),
      alias: aliasInput.value.trim(),
      bank: bankInput.value.trim()
    };
    
    const contacts = getContacts();
    contacts.push(newContact);
    saveContacts(contacts);
    
    renderContacts(); // Refrescar lista de contactos
    if (typeof initAutocomplete === 'function') {
      initAutocomplete(); // Refrescar la fuente de autocompletado
    }
    closeModal();     // Ocultar modal
    
    alert(`¡Contacto Agregado!\n\n${newContact.name} se ha añadido exitosamente a tu agenda.`);
  });
}

// ── 8. PROCESAR ENVÍO EN EL SUBMIT ──────────────────────────
const sendForm = document.getElementById('sendForm');
const searchInput = document.getElementById('searchContact');

if (sendForm) {
  sendForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitamos la redirección nativa

    const contact = searchInput.value.trim();
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const currentBalance = getBalance();

    // Validar si el monto es mayor que el saldo disponible
    if (amount > currentBalance) {
      alert(`¡Error: Saldo Insuficiente!\n\nEl monto a enviar ($${formatCurrency(amount)}) supera tu saldo actual ($${formatCurrency(currentBalance)}).`);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert('¡Error!\n\nPor favor, ingresa un monto válido mayor a cero.');
      return;
    }

    // Restar el saldo
    const newBalance = currentBalance - amount;
    saveBalance(newBalance);

    // Guardar transacción
    saveTransaction(`Envío a ${contact}`, amount, 'withdrawal');

    // Mostrar mensaje de éxito en JavaScript
    alert(`¡Envío Exitoso!\n\nHas enviado: $${formatCurrency(amount)} a ${contact}\nTu nuevo saldo es: $${formatCurrency(newBalance)}`);

    // Limpiar campos y actualizar pantalla
    amountInput.value = '';
    searchInput.value = '';
    
    const listEl = document.getElementById('contactList');
    if (listEl) {
      const allItems = listEl.querySelectorAll('.list-group-item-custom');
      allItems.forEach(el => el.classList.remove('active'));
    }
    
    updateBalanceDisplay();
  });
}

// Cargar saldo y contactos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  updateBalanceDisplay();
  renderContacts();
});

// ── 9. AUTOCOMPLETAR Y FILTRAR CON JQUERY / JQUERY UI ─────────────────
function initAutocomplete() {
  const contacts = getContacts();
  
  // Mapeamos los contactos en el formato que requiere jQuery UI Autocomplete
  const availableTags = contacts.map(c => ({
    label: `${c.name} - CBU: ${c.cbu} (${c.bank})`,
    value: c.name,
    original: c
  }));
  
  // Inicializa o destruye e inicializa el plugin de autocompletado en el buscador
  const $search = $('#searchContact');
  if ($search.length) {
    if ($search.data('ui-autocomplete')) {
      $search.autocomplete('destroy');
    }
    $search.autocomplete({
      source: availableTags,
      select: function(event, ui) {
        const selectedContact = ui.item.original;
        
        // Al seleccionar, marcamos como activo el elemento en la lista visual de contactos
        $('#contactList .list-group-item-custom').each(function() {
          const nameText = $(this).find('.contact-name').text().trim();
          if (nameText === selectedContact.name) {
            $('#contactList .list-group-item-custom').removeClass('active');
            $(this).addClass('active');
          }
        });
      }
    });
  }
}

// Inicialización de jQuery
$(document).ready(function() {
  // Inicializamos el autocompletado de jQuery UI
  initAutocomplete();
  
  // Filtrar la lista de contactos en tiempo real mientras el usuario escribe en el input
  $('#searchContact').on('input keyup', function() {
    const query = $(this).val().toLowerCase().trim();
    
    $('#contactList .list-group-item-custom').each(function() {
      const name = $(this).find('.contact-name').text().toLowerCase();
      const details = $(this).find('.contact-details').text().toLowerCase();
      
      // Si coincide el nombre o los detalles (CBU, Alias, Banco), se muestra; si no, se oculta
      if (name.includes(query) || details.includes(query)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
});
