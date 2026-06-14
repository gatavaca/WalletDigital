// Seleccionamos los elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Escuchamos el evento submit del formulario
loginForm.addEventListener('submit', (event) => {
  // Prevenimos el envío nativo del formulario
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación: si algún campo está vacío, mostramos el error
  if (email === '' || password === '') {
    errorMessage.textContent = 'Error al ingresar el usuario o contraseña. Intenta nuevamente.';
    errorMessage.style.display = 'block';
  } else {
    // Si ambos campos tienen contenido, redirigimos al menú
    errorMessage.style.display = 'none';
    window.location.href = 'menu.html';
  }
});
