const pool = require('../db');

exports.crearConversacion = async (anuncio_id, interesado_id) => {
  const result = await pool.query(
    `INSERT INTO conversacion (anuncio_id, interesado_id)
     VALUES ($1, $2)
     RETURNING *`,
    [anuncio_id, interesado_id]
  );
  return result.rows[0];
};

exports.obtenerConversacionesPorUsuario = async (usuario_id) => {
  const result = await pool.query(
    `SELECT c.*, a.titulo, u.nombre_completo AS vendedor
     FROM conversacion c
     JOIN anuncio a ON c.anuncio_id = a.id
     JOIN usuario u ON a.vendedor_id = u.id
     WHERE c.interesado_id = $1 OR a.vendedor_id = $1
     ORDER BY c.id DESC`,
    [usuario_id]
  );
  return result.rows;
};

exports.existeConversacion = async (anuncio_id, interesado_id) => {
  const result = await pool.query(
    `SELECT * FROM conversacion WHERE anuncio_id = $1 AND interesado_id = $2`,
    [anuncio_id, interesado_id]
  );
  return result.rows[0];
};