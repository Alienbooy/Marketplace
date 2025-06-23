const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const clienteRepository = require('../repositories/clienteRepository');

exports.registrarCliente = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existe = await clienteRepository.correoYaExiste(email);
    if (existe) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await clienteRepository.crearUsuario(nombre, email, hashedPassword);

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      id_usuario: nuevoUsuario.id
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
  }
};

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const usuario = await clienteRepository.buscarPorCorreo(email);
    if (!usuario) {
      return res.status(404).json({ message: 'Credenciales incorrectas.' });
    }

    const contrasenaValida = await bcrypt.compare(password, usuario.contrasenia);
    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const payload = { id_usuario: usuario.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      nombre: usuario.nombre_completo,
      id_usuario: usuario.id
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
  }
};

