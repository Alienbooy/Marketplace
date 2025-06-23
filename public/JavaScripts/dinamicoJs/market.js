document.addEventListener('DOMContentLoaded', () => {
  const categoriasLinks = document.querySelectorAll('.nav-categorias li a');

  const container = document.createElement('section');
  container.classList.add('productos-grid');

  document.querySelector('main').appendChild(container);

  async function cargarAnuncios(categoria = '') {
    let url = '/api/anuncios';
    if (categoria) {
      url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    try {
      const response = await fetch(url);
      const anuncios = await response.json();
      container.innerHTML = ''; 

      if (anuncios.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay anuncios disponibles para esta categoría.';
        container.appendChild(mensaje);
        return;
      }

      anuncios.forEach(anuncio => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        
        const img = document.createElement('img');
        img.src = anuncio.imagenes.length > 0 ? anuncio.imagenes[0].url : '/image/default.jpg';
        img.alt = anuncio.titulo;

        
        const title = document.createElement('h3');
        title.textContent = anuncio.titulo;

        
        const price = document.createElement('p');
        price.classList.add('precio');
        price.textContent = `Precio: ${anuncio.precio} Bs`;

        
        const estado = document.createElement('p');
        estado.classList.add('estado');
        estado.textContent = `Estado: ${anuncio.estado}`;

        
        const anunciante = document.createElement('p');
        anunciante.classList.add('anunciante');
        anunciante.textContent = `Anunciante: ${anuncio.vendedor || 'No disponible'}`;


        const botonDetalle = document.createElement('button');
        botonDetalle.textContent = 'Detalle';
        botonDetalle.classList.add('ver-detalle');
        botonDetalle.onclick = () => {
            window.location.href = `./detalle.html?id=${anuncio.id}`;
        };
        
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(estado);
        card.appendChild(anunciante);
        card.appendChild(botonDetalle);



        container.appendChild(card);
      });
    } catch (error) {
      console.error('Error al cargar anuncios:', error);
      const errorMsg = document.createElement('p');
      errorMsg.textContent = 'Hubo un error al cargar los anuncios.';
      container.appendChild(errorMsg);
    }
  }
 
    cargarAnuncios();
  
    categoriasLinks.forEach(link => {
        link.addEventListener('click', e => {
        e.preventDefault();
        const categoria = link.textContent.trim();
        cargarAnuncios(categoria);
        });
    });
});

