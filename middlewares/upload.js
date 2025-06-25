const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.resolve(__dirname, '..', process.env.UPLOADS_FOLDER || 'public/uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Formato de imagen inválido'), false);
  }
  cb(null, true);
};

module.exports = {
  uploadCrear: multer({ storage, fileFilter }).array('imagenes', 6),
  uploadEditar: multer({ storage, fileFilter }).array('imagenes', 5)
};
