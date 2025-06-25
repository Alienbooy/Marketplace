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
