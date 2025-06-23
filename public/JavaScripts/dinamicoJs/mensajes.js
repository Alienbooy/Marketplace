document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const container = document.getElementById('mensajes-container');

  if (!token) {
    container.innerHTML = '<p>Debes iniciar sesión para ver tus mensajes.</p>';
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const usuarioId = payload.id;

  try {
    const res = await fetch('/api/conversaciones', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const conversaciones = await res.json();

    if (!conversaciones.length) {
      container.innerHTML = '<p>No tienes conversaciones activas.</p>';
      return;
    }

    container.innerHTML = '<h2>Mis Conversaciones</h2>';

    for (let conv of conversaciones) {
      const bloque = document.createElement('div');
      bloque.classList.add('conversacion-card');

      const tipo = conv.interesado_id === usuarioId ? 'Comprando' : 'Vendiendo';

      bloque.innerHTML = `
        <h3>${conv.titulo_anuncio}</h3>
        <p><strong>${tipo} con:</strong> ${conv.nombre_usuario}</p>
        <div class="mensajes" id="mensajes-${conv.id}">Cargando mensajes...</div>
        <div class="respuesta">
          <input type="text" placeholder="Escribe tu mensaje..." />
          <button data-id="${conv.id}">Enviar</button>
        </div>
      `;

      container.appendChild(bloque);

      const mensajesRes = await fetch(`/api/mensajes/${conv.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mensajes = await mensajesRes.json();

      const mensajesDiv = document.getElementById(`mensajes-${conv.id}`);
      mensajesDiv.innerHTML = mensajes.map(m => `
        <p><strong>${m.emisor_nombre}:</strong> ${m.contenido}</p>
      `).join('');

      // Enviar mensaje
      bloque.querySelector('button').addEventListener('click', async () => {
        const input = bloque.querySelector('input');
        const contenido = input.value.trim();
        if (!contenido) return alert('Escribe algo para enviar.');

        const resMsg = await fetch('/api/mensajes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ conversacion_id: conv.id, contenido })
        });

        const data = await resMsg.json();
        if (resMsg.ok) {
          mensajesDiv.innerHTML += `<p><strong>Tú:</strong> ${contenido}</p>`;
          input.value = '';
        } else {
          alert(data.message || 'Error al enviar el mensaje.');
        }
      });
    }

  } catch (err) {
    console.error('Error al cargar mensajes:', err);
    container.innerHTML = '<p>Error al mostrar las conversaciones.</p>';
  }
});