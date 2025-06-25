document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const contenedor = document.querySelector('.detalle-conteiner');

  if (!id) {
    contenedor.innerHTML = '<p style="text-align:center; margin:2rem;">No se encontró el anuncio.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/anuncios/${id}`);
    const anuncio = await response.json();

    if (!anuncio) {
      contenedor.innerHTML = '<p style="text-align:center; margin:2rem;">Anuncio no disponible.</p>';
      return;
    }

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
        <button class="btn-like" data-id="${anuncio.id}">Guardar</button>
      </div>
      <p>${anuncio.descripcion || ''}</p>
      <p><strong>Estado:</strong> ${anuncio.estado}</p>
      <p><strong>Precio:</strong> ${anuncio.precio} Bs</p>
      <p><strong>Vendedor:</strong> ${anuncio.vendedor}</p>

      <div class="detalle-chat">
        <input type="text" placeholder="Escriba un mensaje" />
        <button class="btn-enviar">Enviar</button>
      </div>
    `;
 

    contenedor.appendChild(imagenContainer);
    contenedor.appendChild(info);

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
  } catch (error) {
    console.error('Error al cargar el anuncio:', error);
    contenedor.innerHTML = '<p style="text-align:center; margin:2rem;">Error al cargar el anuncio.</p>';
  }
});
