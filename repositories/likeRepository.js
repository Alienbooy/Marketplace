const pool = require('../db');

exports.guardarLike = async (usuarioId, anuncioId) => {
  await pool.query(
    'INSERT INTO anuncio_guardado (usuario_id, anuncio_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [usuarioId, anuncioId]
  );
};

exports.eliminarLike = async (usuarioId, anuncioId) => {
  await pool.query(
    'DELETE FROM anuncio_guardado WHERE usuario_id = $1 AND anuncio_id = $2',
    [usuarioId, anuncioId]
  );
};

exports.obtenerAnunciosGuardados = async (usuarioId) => {
  const query = `
    SELECT a.id, a.titulo, a.precio, u.nombre_completo as vendedor
    FROM anuncio_guardado ag
    JOIN anuncio a ON ag.anuncio_id = a.id
    JOIN usuario u ON a.vendedor_id = u.id
    WHERE ag.usuario_id = $1 AND a.publicado = true
  `;
  const { rows } = await pool.query(query, [usuarioId]);
  return rows;
};

