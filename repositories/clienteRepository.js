const pool = require('../db');

exports.buscarPorCorreo = async (correo) => {
  const result = await pool.query('SELECT id, nombre_completo, contrasenia FROM usuario WHERE correo = $1', [correo]);
  return result.rows[0];
};

exports.correoYaExiste = async (correo) => {
  const result = await pool.query('SELECT id FROM usuario WHERE correo = $1', [correo]);
  return result.rows.length > 0;
};

exports.crearUsuario = async (nombre, correo, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO usuario (nombre_completo, correo, contrasenia) VALUES ($1, $2, $3) RETURNING id',
    [nombre, correo, hashedPassword]
  );
  return result.rows[0];
};
