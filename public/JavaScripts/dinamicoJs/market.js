document.addEventListener('DOMContentLoaded', () => {
  const categoriasLinks = document.querySelectorAll('.nav-categorias li a');
  const btnFiltrar = document.getElementById('btn-filtrar');
  const selectCategorias = document.getElementById('select-categorias');

  const inputBuscarMovil = document.getElementById('input-buscar-movil');
  const btnBuscarMovil = document.getElementById('btn-buscar-movil');

  const container = document.createElement('section');
  container.classList.add('productos-grid');
  document.querySelector('main').appendChild(container);

  const urlParams = new URLSearchParams(window.location.search);
  const terminoBusqueda = urlParams.get('q');

  if (terminoBusqueda) {
    buscarAnuncios(terminoBusqueda);
  } else {
    cargarAnuncios();
  }

  if (btnFiltrar && selectCategorias) {
    btnFiltrar.addEventListener('click', () => {
      const categoria = selectCategorias.value;
      cargarAnuncios(categoria);
    });
  }

  if (btnBuscarMovil && inputBuscarMovil) {
    btnBuscarMovil.addEventListener('click', () => {
      const query = inputBuscarMovil.value.trim();
      if (query) {
        window.location.href = `/market.html?q=${encodeURIComponent(query)}`;
      }
    });

    inputBuscarMovil.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = inputBuscarMovil.value.trim();
        if (query) {
          window.location.href = `/market.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  categoriasLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const categoria = link.textContent.trim();
      cargarAnuncios(categoria);
    });
  });

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
        container.innerHTML = '<p>No hay anuncios disponibles para esta categoría.</p>';
        return;
      }

      anuncios.forEach(anuncio => crearCard(anuncio));
    } catch (error) {
      console.error('Error al cargar anuncios:', error);
      container.innerHTML = '<p>Hubo un error al cargar los anuncios.</p>';
    }
  }

  async function buscarAnuncios(termino) {
    try {
      const res = await fetch(`/api/anuncios/buscar?q=${encodeURIComponent(termino)}`);
      const anuncios = await res.json();
      container.innerHTML = '';

      if (anuncios.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
      }

      anuncios.forEach(anuncio => crearCard(anuncio));
    } catch (error) {
      console.error('Error al buscar anuncios:', error);
      container.innerHTML = '<p>Error al buscar anuncios.</p>';
    }
  }

  function crearCard(anuncio) {
    const card = document.createElement('div');
    card.classList.add('producto-card');

    const img = document.createElement('img');
    img.src = anuncio.imagenes?.length > 0 ? anuncio.imagenes[0].url : '/image/default.jpg';
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
  }
});


