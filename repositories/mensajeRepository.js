const pool = require('../db');

exports.crearMensaje = async (contenido, emisor_id, conversacion_id) => {
  const query = `
    INSERT INTO mensaje (contenido, emisor_id, conversacion_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [contenido, emisor_id, conversacion_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.obtenerMensajesPorConversacion = async (conversacion_id) => {
  const query = `
    SELECT m.*, u.nombre_completo AS emisor_nombre
    FROM mensaje m
    JOIN usuario u ON m.emisor_id = u.id
    WHERE m.conversacion_id = $1
    ORDER BY m.fecha_hora ASC
  `;
  const { rows } = await pool.query(query, [conversacion_id]);
  return rows;
};