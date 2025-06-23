document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('lista-likes');
  const token = localStorage.getItem('token');

  if (!token) {
    container.innerHTML = '<p>Debes iniciar sesión para ver tus anuncios guardados.</p>';
    return;
  }

  try {
    const res = await fetch('/api/likes', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const likes = await res.json();

    if (!Array.isArray(likes) || likes.length === 0) {
      container.innerHTML = '<p>No tienes anuncios guardados.</p>';
      return;
    }

    container.innerHTML = '';
    likes.forEach(anuncio => {
      const img = anuncio.imagenes?.[0]?.url || '/uploads/default.png';
      const card = document.createElement('div');
      card.classList.add('anuncio-card');
      card.innerHTML = `
        <img src="${img}" alt="Imagen del anuncio" />
        <h2>${anuncio.titulo}</h2>
        <p><strong>Precio:</strong> ${anuncio.precio} Bs</p>
        <p><strong>Vendedor:</strong> ${anuncio.vendedor}</p>
        <div class="boton-group">
          <button class="btn-like" data-id="${anuncio.id}">Quitar</button>
          <button class="btn-ver" onclick="window.location.href='/detalle.html?id=${anuncio.id}'">Ver detalle</button>
        </div>
      `;

      card.querySelector('.btn-like').addEventListener('click', async () => {
        const res = await fetch(`/api/likes/${anuncio.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        alert(data.message);
        card.remove();
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error al cargar tus likes:', err);
    container.innerHTML = '<p>Error al cargar tus likes.</p>';
  }
});
