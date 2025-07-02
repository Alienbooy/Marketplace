const pool = require('../db');

exports.existeConversacion = async (anuncio_id, interesado_id) => {
  const query = `
    SELECT * FROM conversacion
    WHERE anuncio_id = $1 AND interesado_id = $2
  `;
  const { rows } = await pool.query(query, [anuncio_id, interesado_id]);
  return rows[0];
};

exports.crearConversacion = async (anuncio_id, interesado_id) => {
  const query = `
    INSERT INTO conversacion (anuncio_id, interesado_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [anuncio_id, interesado_id]);
  return rows[0];
};


exports.obtenerConversacionesPorUsuario = async (usuarioId) => {
  const result = await pool.query(`
    SELECT 
      c.id AS conversacion_id,
      a.id AS anuncio_id,
      a.titulo AS anuncio_titulo,
      u.nombre_completo AS vendedor_nombre
    FROM conversacion c
    JOIN anuncio a ON c.anuncio_id = a.id
    JOIN usuario u ON a.vendedor_id = u.id
    WHERE c.interesado_id = $1
  `, [usuarioId]);

  return result.rows;
};


exports.obtenerConversacionesDeMisAnuncios = async (usuarioId) => {
  const result = await pool.query(`
    SELECT 
      c.id AS conversacion_id,
      a.id AS anuncio_id,
      a.titulo AS anuncio_titulo,
      u.nombre_completo AS interesado_nombre
    FROM conversacion c
    JOIN anuncio a ON c.anuncio_id = a.id
    JOIN usuario u ON c.interesado_id = u.id
    WHERE a.vendedor_id = $1
  `, [usuarioId]);

  return result.rows;
};


