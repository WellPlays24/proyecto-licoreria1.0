// ============================================
// SERVIDOR PRINCIPAL
// ============================================

const app = require('./app');
const { testConnection } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ============================================
// INICIAR SERVIDOR
// ============================================

const startServer = async () => {
  try {
    // 1. Probar conexión a la base de datos
    console.log('🔄 Probando conexión a PostgreSQL...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.error('👉 Verifica tu archivo .env y que PostgreSQL esté corriendo');
      process.exit(1);
    }

    // 2. Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('🚀 Servidor iniciado correctamente');
      console.log('═══════════════════════════════════════════');
      console.log(`📡 Servidor escuchando en: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
      console.log('═══════════════════════════════════════════');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Iniciar
startServer();