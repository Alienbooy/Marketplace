const pool = require('../db');

exports.guardarImagen = async (url, anuncio_id) => {
  const query = `INSERT INTO imagen (url, anuncio_id) VALUES ($1, $2)`;
  await pool.query(query, [url, anuncio_id]);
};


exports.obtenerImagenesPorAnuncio = async (anuncioId) => {
  const result = await pool.query(
    'SELECT url FROM imagen WHERE anuncio_id = $1',
    [anuncioId]
  );
  return result.rows;
};

