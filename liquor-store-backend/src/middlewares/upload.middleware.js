// ============================================
// MIDDLEWARE DE UPLOAD DE IMÁGENES
// ============================================

const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ============================================
// CONFIGURACIÓN DE MULTER
// ============================================

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar almacenamiento en memoria (para procesar con Sharp)
const storage = multer.memoryStorage();

// Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan: JPG, JPEG, PNG, WEBP'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE || 5) * 1024 * 1024 // Default 5MB
  }
});

// ============================================
// MIDDLEWARE PARA SUBIR IMAGEN DE PRODUCTO
// ============================================

const uploadProductImage = upload.single('image');

// ============================================
// MIDDLEWARE PARA PROCESAR Y REDIMENSIONAR IMAGEN
// ============================================

const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No se proporcionó ninguna imagen',
        message: 'Debe seleccionar una imagen para subir'
      });
    }

    // Generar nombre único para la imagen
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Procesar imagen con Sharp
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside', // Mantiene proporción
        withoutEnlargement: true // No agranda imágenes pequeñas
      })
      .webp({ quality: 85 }) // Convertir a WebP con calidad 85%
      .toFile(filepath);

    // Agregar información de la imagen al request
    req.imageInfo = {
      filename: filename,
      path: `/uploads/products/${filename}`,
      size: req.file.size,
      mimetype: 'image/webp'
    };

    next();
  } catch (error) {
    console.error('Error al procesar imagen:', error);
    return res.status(500).json({
      error: 'Error al procesar la imagen',
      message: error.message
    });
  }
};

// ============================================
// MIDDLEWARE PARA ELIMINAR IMAGEN ANTERIOR
// ============================================

const deleteImage = (imagePath) => {
  try {
    if (!imagePath) return;

    // Extraer solo el nombre del archivo
    const filename = path.basename(imagePath);
    const fullPath = path.join(uploadDir, filename);

    // Verificar si el archivo existe y eliminarlo
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Imagen eliminada: ${filename}`);
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error.message);
  }
};

// ============================================
// MANEJADOR DE ERRORES DE MULTER
// ============================================

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande',
        message: `El tamaño máximo permitido es ${process.env.MAX_FILE_SIZE || 5}MB`
      });
    }
    return res.status(400).json({
      error: 'Error al subir archivo',
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      error: 'Error al subir archivo',
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  uploadProductImage,
  processImage,
  deleteImage,
  handleMulterError
};