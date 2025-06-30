async function cargarDestacados() {
  try {
    const res = await fetch('/api/anuncios/destacados');
    const destacados = await res.json();

    if (!Array.isArray(destacados)) throw new Error("Respuesta inválida del servidor");

    const container = document.getElementById('destacados');
    container.innerHTML = '';

    destacados.forEach(d => {
      const card = document.createElement('div');
      card.className = 'destacado-card';
      card.innerHTML = `
        <img src="${d.imagen}" alt="${d.titulo}">
        <h3>${d.titulo}</h3>
        <p>${d.estado} - $${d.precio}</p>
        <span class="vendedor">Vendedor: ${d.vendedor}</span>
        <div style="margin-top: 10px;">
          <a href="/detalle.html?id=${d.id}" class="detalle-btn">Ver Detalle</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarDestacados);
