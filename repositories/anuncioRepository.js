const pool = require('../db');

exports.obtenerPublicados = async (nombreCategoria) => {
  let sql = `
    SELECT a.id, a.titulo, a.descripcion, a.precio, a.estado,
           c.nombre AS categoria, u.nombre_completo AS vendedor
    FROM anuncio a
    JOIN categoria c ON a.categoria_id = c.id
    JOIN usuario   u ON a.vendedor_id = u.id
    WHERE a.publicado = TRUE
  `;
  const params = [];
  if (nombreCategoria) {
    sql += ' AND c.nombre = $1';
    params.push(nombreCategoria);
  }
  return (await pool.query(sql, params)).rows;
};


exports.obtenerPorVendedor = async (idVendedor) => {
  return (
    await pool.query('SELECT * FROM anuncio WHERE vendedor_id = $1 ORDER BY id DESC', [idVendedor])
  ).rows;
};

exports.obtenerPorCategoria = async (nombreCategoria) => {
  const sql = `
    SELECT a.*, c.nombre AS categoria, u.nombre_completo AS vendedor
    FROM anuncio a
    JOIN categoria c ON a.categoria_id = c.id
    JOIN usuario u ON a.vendedor_id = u.id
    WHERE LOWER(c.nombre) = LOWER($1)
    ORDER BY a.id DESC
  `;
  const { rows } = await pool.query(sql, [nombreCategoria]);
  return rows;
};


exports.obtenerPorId = async (id) => {
  const sql = `
    SELECT a.id, a.titulo, a.descripcion, a.precio, a.estado, 
           a.vendedor_id,
           c.nombre AS categoria, 
           u.nombre_completo AS vendedor
    FROM anuncio a
    JOIN categoria c ON a.categoria_id = c.id
    JOIN usuario   u ON a.vendedor_id = u.id
    WHERE a.id = $1
  `;
  const { rows } = await pool.query(sql, [id]);
  return rows[0];
};


exports.insertarImagen = async (anuncioId, url) => {
  await pool.query('INSERT INTO imagen (url, anuncio_id) VALUES ($1, $2)', [url, anuncioId]);
};

exports.contarImagenes = async (anuncioId) => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM imagen WHERE anuncio_id = $1', [anuncioId]);
  return parseInt(rows[0].count);
};

exports.obtenerParaEliminar = async (id, idVendedor) => {
  const { rows } = await pool.query(
    'SELECT * FROM anuncio WHERE id = $1 AND vendedor_id = $2',
    [id, idVendedor]
  );
  return rows[0];
};

exports.tieneConversaciones = async (id) => {
  const { rows } = await pool.query(
    'SELECT 1 FROM conversacion WHERE anuncio_id = $1 LIMIT 1',
    [id]
  );
  return rows.length > 0;
};

exports.despublicar = async (id) => {
  await pool.query('UPDATE anuncio SET publicado = FALSE WHERE id = $1', [id]);
};

exports.eliminar = async (id) => {
  await pool.query('DELETE FROM imagen WHERE anuncio_id = $1', [id]);

  
  await pool.query('DELETE FROM anuncio WHERE id = $1', [id]);
};

exports.cambiarPublicado = async (publicado, id, idVendedor) => {
  const { rows } = await pool.query(
    'UPDATE anuncio SET publicado = $1 WHERE id = $2 AND vendedor_id = $3 RETURNING publicado',
    [publicado, id, idVendedor]
  );
  return rows[0];
};

exports.crearAnuncio = async ({ titulo, descripcion, precio, estado, categoria_id, idVendedor }) => {
  const result = await pool.query(
    `INSERT INTO anuncio (titulo, descripcion, precio, estado, publicado, vendedor_id, categoria_id)
     VALUES ($1, $2, $3, $4, TRUE, $5, $6) RETURNING id`,
    [titulo, descripcion, precio, estado, idVendedor, categoria_id]
  );
  return result.rows[0].id; 
};


exports.actualizarAnuncio = async (id, { titulo, descripcion, precio, estado, categoria_id }) => {
  const result = await pool.query(
    `UPDATE anuncio 
     SET titulo = $1, descripcion = $2, precio = $3, estado = $4, categoria_id = $5 
     WHERE id = $6 RETURNING *`,
    [titulo, descripcion, precio, estado, categoria_id, id]
  );
  return result.rows[0];
};

