document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const contenedor = document.querySelector('.detalle-conteiner');

  if (!id) {
    contenedor.innerHTML = '<p style="text-align:center; margin:14px;">No se encontró el anuncio.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/anuncios/${id}`);
    const anuncio = await response.json();

    if (!anuncio) {
      contenedor.innerHTML = '<p style="text-align:center; margin:14px;">Anuncio no disponible.</p>';
      return;
    }

    const token = localStorage.getItem('token');
    let usuarioId = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        usuarioId = payload.id_usuario;
      } catch (e) {
        console.warn('Token inválido.');
      }
    }

    const esPropio = usuarioId && usuarioId === anuncio.vendedor_id;

    const imagenContainer = document.createElement('div');
    imagenContainer.classList.add('carousel-container');

    const slider = document.createElement('div');
    slider.classList.add('carousel-slider');

    anuncio.imagenes.forEach((img) => {
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');

      const imagen = document.createElement('img');
      imagen.src = img.url;
      imagen.alt = anuncio.titulo;

      slide.appendChild(imagen);
      slider.appendChild(slide);
    });

    const prevBtn = document.createElement('button');
    prevBtn.classList.add('carousel-btn', 'prev');
    prevBtn.innerHTML = '&#10094;';

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('carousel-btn', 'next');
    nextBtn.innerHTML = '&#10095;';

    imagenContainer.appendChild(prevBtn);
    imagenContainer.appendChild(slider);
    imagenContainer.appendChild(nextBtn);

    const info = document.createElement('div');
    info.classList.add('detalle-info');
    info.innerHTML = `
      <div class="titulo-like">
        <h2>${anuncio.titulo}</h2>
        <button class="btn-like" data-id="${anuncio.id}" ${esPropio ? 'disabled class="btn-like desactivado" title="No puedes guardar tu propio anuncio"' : ''}>
        ${esPropio ? 'Desactivado' : 'Guardar'}
      </button>
      </div>
      <p>${anuncio.descripcion || ''}</p>
      <p><strong>Estado:</strong> ${anuncio.estado}</p>
      <p><strong>Precio:</strong> ${anuncio.precio} Bs</p>
      <p><strong>Vendedor:</strong> ${anuncio.vendedor}</p>

      <div class="detalle-chat">
        <input type="text" placeholder="Escriba un mensaje" ${esPropio ? 'disabled' : ''}/>
        <button class="btn-enviar" ${esPropio ? 'disabled class="btn-like desactivado" title="No puedes enviarte mensajes a ti mismo"' : ''}>${esPropio ? 'Desactivado' : 'Enviar'}</button>
      </div>
    `;

    contenedor.appendChild(imagenContainer);
    contenedor.appendChild(info);

    
    const btnLike = info.querySelector('.btn-like');
    if (btnLike && !esPropio) {
      btnLike.addEventListener('click', async () => {
        if (!token) {
          return;
        }

        try {
          const res = await fetch(`/api/likes/${id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          
          const data = await res.json();
          // Verifica si la respuesta es exitosa y si el anuncio ya está guardado
          if (res.ok) {
            btnLike.disabled = true;
            btnLike.textContent = 'Guardado';
          } else {
            alert(data.message || 'Error al guardar anuncio.');
          }
        } catch (error) {
          console.error('Error al guardar anuncio:', error);
          alert('Error al guardar anuncio.');
        }
      });
    }

    let currentIndex = 0;
    const slides = slider.querySelectorAll('.carousel-slide');

    function showSlide(index) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    showSlide(currentIndex);

  
    const btnEnviar = info.querySelector('.btn-enviar');
    const inputMensaje = info.querySelector('input[type="text"]');

    if (btnEnviar && inputMensaje && !esPropio) {
      btnEnviar.addEventListener('click', async () => {
        const contenido = inputMensaje.value.trim();
        if (!contenido) return;

        if (!token) {
          alert('Debes iniciar sesión para enviar mensajes.');
          return;
        }

        try {
          const res = await fetch('/api/mensajes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              anuncio_id: id,
              contenido
            })
          });

          const data = await res.json();

          if (res.ok) {
            inputMensaje.value = '';
          } else {
            alert(data.mensaje || 'Error al enviar mensaje.');
          }

        } catch (error) {
          console.error('Error al enviar mensaje:', error);
          alert('Error al enviar mensaje.');
        }
      });
    }

  } catch (error) {
    console.error('Error al cargar el anuncio:', error);
    contenedor.innerHTML = '<p style="text-align:center; margin:12px;">Error al cargar el anuncio.</p>';
  }
});
