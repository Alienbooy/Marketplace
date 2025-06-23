document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const dropdownContent = document.querySelector('.dropdown-content');

  const logoutItem = document.createElement('li');
  const logoutButton = document.createElement('a');
  logoutButton.href = '#';
  logoutButton.textContent = 'Cerrar sesión';
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    
    window.location.href = './index.html';
  });
  logoutItem.appendChild(logoutButton);

  if (token) {

    document.querySelector('a[href="./likes.html"]').style.display = 'block';
    document.querySelector('a[href="./formulario.html"]').style.display = 'block';
    document.querySelector('a[href="./misAnuncios.html"]').style.display = 'block';
    document.querySelector('a[href="./mensajes.html"]').style.display = 'block';

    dropdownContent.appendChild(logoutItem);

    document.querySelector('a[href="/login.html"]').style.display = 'none';
    document.querySelector('a[href="/registro.html"]').style.display = 'none';

  } else {
    document.querySelector('a[href="./likes.html"]').style.display = 'none';
    document.querySelector('a[href="./formulario.html"]').style.display = 'none';
    document.querySelector('a[href="./misAnuncios.html"]').style.display = 'none';
    document.querySelector('a[href="./mensajes.html"]').style.display = 'none';
  }
}); 
