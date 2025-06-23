document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const likeBtn = document.querySelector('.btn-like');
  const params = new URLSearchParams(window.location.search);
  const anuncioId = params.get('id');
  if (!likeBtn || !anuncioId) return;

  let guardado = false;

  if (token) {
    try {
      const res = await fetch('/api/likes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const likes = await res.json();
      guardado = likes.some(anuncio => anuncio.id == anuncioId);
      actualizarBoton();
    } catch (err) {
      console.error('Error al obtener likes:', err);
    }
  }

  likeBtn.addEventListener('click', async () => {
    if (!token) {
      alert('Debes iniciar sesión para guardar anuncios.');
      window.location.href = '/login.html';
      return;
    }

    try {
      const metodo = guardado ? 'DELETE' : 'POST';
      const res = await fetch(`/api/likes/${anuncioId}`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      guardado = !guardado;
      actualizarBoton();
      alert(data.message);
    } catch (err) {
      console.error('Error al guardar/quitar like:', err);
      alert(err.message || 'Error al procesar el like.');
    }
  });

  function actualizarBoton() {
    if (guardado) {
      likeBtn.textContent = 'Guardado';
      likeBtn.classList.add('guardado');
    } else {
      likeBtn.textContent = 'Guardar';
      likeBtn.classList.remove('guardado');
    }
  }
});
