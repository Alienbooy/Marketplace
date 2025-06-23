document.addEventListener('DOMContentLoaded', () => {
  
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const errorEmail = document.getElementById('error-login-email');
    const errorPassword = document.getElementById('error-login-password');
    const errorGeneral = document.getElementById('login-error-mensaje');

    [errorEmail, errorPassword, errorGeneral].forEach(e => {
      e.innerText = '';
      e.style.display = 'none';
    });

    let valido = true;

    if (!email) {
      errorEmail.innerText = 'Por favor, ingrese su correo electrónico.';
      errorEmail.style.display = 'block';
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEmail.innerText = 'Ingrese un correo electrónico válido.';
      errorEmail.style.display = 'block';
      valido = false;
    }

    if (!password) {
      errorPassword.innerText = 'Ingrese su contraseña.';
      errorPassword.style.display = 'block';
      valido = false;
    }

    if (!valido) return;

    try {
      const response = await fetch('api/cliente/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('nombre', data.nombre);

        window.location.href = './index.html';
      } else if (response.status === 401) {
        errorGeneral.innerText = 'Correo o contraseña incorrectos.';
        errorGeneral.style.display = 'block';
      } else {
        const error = await response.json();
        errorGeneral.innerText = error.message || 'Error al iniciar sesión.';
        errorGeneral.style.display = 'block';
      }
    } catch (error) {
      errorGeneral.innerText = 'No se pudo conectar al servidor.';
      errorGeneral.style.display = 'block';
      console.error(error);
    }
  });

  
  const registroForm = document.getElementById('registro-form');

  registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('registro-nombre').value.trim();
    const email = document.getElementById('registro-email').value.trim();
    const password = document.getElementById('registro-password').value.trim();

    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorPassword = document.getElementById('error-password');
    const errorGeneral = document.getElementById('registro-error-mensaje');

    [errorNombre, errorEmail, errorPassword, errorGeneral].forEach(e => {
      e.innerText = '';
      e.style.display = 'none';
    });

    let valido = true;

    if (!nombre) {
      errorNombre.innerText = 'Por favor, ingrese su nombre completo.';
      errorNombre.style.display = 'block';
      valido = false;
    }

    if (!email) {
      errorEmail.innerText = 'Por favor, ingrese su correo electrónico.';
      errorEmail.style.display = 'block';
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEmail.innerText = 'Ingrese un correo válido.';
      errorEmail.style.display = 'block';
      valido = false;
    }

    if (!password) {
      errorPassword.innerText = 'Ingrese una contraseña.';
      errorPassword.style.display = 'block';
      valido = false;
    } else if (password.length < 8) {
      errorPassword.innerText = 'La contraseña debe tener al menos 8 caracteres.';
      errorPassword.style.display = 'block';
      valido = false;
    }

    if (!valido) return;

    try {
      const response = await fetch('api/cliente/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Registro exitoso');
        registroForm.reset();
      } else {
        const error = await response.json();
        if (response.status === 409) {
          errorEmail.innerText = 'Este correo ya está registrado.';
          errorEmail.style.display = 'block';
        } else {
          errorGeneral.innerText = error.message || 'Error al registrar.';
          errorGeneral.style.display = 'block';
        }
      }
    } catch (error) {
      errorGeneral.innerText = 'No se pudo conectar con el servidor.';
      errorGeneral.style.display = 'block';
      console.error(error);
    }
  });
});