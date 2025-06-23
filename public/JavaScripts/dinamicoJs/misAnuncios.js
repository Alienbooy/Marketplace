document.addEventListener('DOMContentLoaded', async () => {
const main = document.getElementById('mis-anuncios');
const token = localStorage.getItem('token');

  if (!token) {
    main.innerHTML = '<p>Debes iniciar sesión para ver tus anuncios.</p>';
    return;
  }

  try {
    const res = await fetch('/api/anuncios/mis', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const anuncios = await res.json();

    if (!Array.isArray(anuncios)) throw new Error("Formato inesperado");

    main.innerHTML = '';

    anuncios.forEach(anuncio => {
      const card = document.createElement('div');
      card.className = 'anuncio-card';

      const imagen = anuncio.imagenes?.[0]?.url || './uploads/default.png';

    card.innerHTML = `
      <img src="${imagen}" alt="Imagen del anuncio">
      <h2>${anuncio.titulo}</h2>
      <p>${anuncio.descripcion}</p>
      <p><strong>Estado:</strong> ${anuncio.estado}</p>
      <p><strong>Precio:</strong> ${anuncio.precio} Bs.</p>
      <p><strong>Publicado:</strong> ${anuncio.publicado ? 'Sí' : 'No'}</p>
      <div class="boton-group">
        <button class="toggle-btn">${anuncio.publicado ? 'Deshabilitar' : 'Habilitar'}</button>
        <button class="delete-btn">Eliminar</button>
        <a href="/formulario.html?id=${anuncio.id}" class="edit-btn">Editar</a>
      </div>
    `;
      card.querySelector('.toggle-btn').addEventListener('click', () =>
        togglePublicado(anuncio.id, !anuncio.publicado)
      );

      card.querySelector('.delete-btn').addEventListener('click', () =>
        eliminarAnuncio(anuncio.id)
      );

      main.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    main.innerHTML = '<p>Error al cargar los anuncios.</p>';
  }
});

async function togglePublicado(id, estado) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/anuncios/${id}/publicado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ publicado: estado })
    });
    const data = await res.json();
    alert(data.message);
    location.reload();
  } catch (err) {
    alert('Error al cambiar estado.');
  }
}

async function eliminarAnuncio(id) {
  const token = localStorage.getItem('token');
  if (!confirm('¿Seguro que deseas eliminar este anuncio?')) return;
  try {
    const res = await fetch(`/api/anuncios/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message);
    location.reload();
  } catch (err) {
    alert('Error al eliminar anuncio.');
  }
}
