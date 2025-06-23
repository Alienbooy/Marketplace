document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-anuncio');
  const preview = document.querySelector('.imagen-preview');
  const inputImagenes = document.getElementById('imagenes');
  const params = new URLSearchParams(window.location.search);
  const anuncioId = params.get('id');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión.');
    window.location.href = '/login.html';
    return;
  }


  if (anuncioId) {
    try {
      const res = await fetch(`/api/anuncios/${anuncioId}`);
      const anuncio = await res.json();

      if (!anuncio || anuncio.error) {
        alert('No se pudo cargar el anuncio.');
        return;
      }

      form.titulo.value = anuncio.titulo;
      form.descripcion.value = anuncio.descripcion;
      form.precio.value = anuncio.precio;
      form.estado.value = anuncio.estado;
      form.categoria.value = anuncio.categoria_id || 1;

      if (anuncio.imagenes?.length > 0) {
        anuncio.imagenes.forEach(img => {
          const imgEl = document.createElement('img');
          imgEl.src = img.url;
          imgEl.classList.add('img-prev');
          preview.appendChild(imgEl);
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error al cargar el anuncio.');
    }
  }

  inputImagenes.addEventListener('change', () => {
    preview.innerHTML = '';
    Array.from(inputImagenes.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.classList.add('img-prev');
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const files = inputImagenes.files;
    const max = anuncioId ? 5 : 6;
    if (files.length > max) {
      alert(`Puedes subir hasta ${max} imágenes.`);
      return;
    }

    const formData = new FormData();
    formData.append('titulo', form.titulo.value);
    formData.append('descripcion', form.descripcion.value);
    formData.append('precio', form.precio.value);
    formData.append('estado', form.estado.value);
    formData.append('categoria', form.categoria.value);
    for (let file of files) {
      formData.append('imagenes', file);
    }

    try {
      const res = await fetch(anuncioId ? `/api/anuncios/${anuncioId}` : '/api/anuncios', {
        method: anuncioId ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert(result.message || 'Anuncio guardado correctamente.');
      window.location.href = '/misAnuncios.html';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al enviar el formulario.');
    }
  });
});
