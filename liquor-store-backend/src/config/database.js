// ============================================
// CONFIGURACIÓN DE BASE DE DATOS PostgreSQL
// ============================================

const { Pool } = require('pg');
require('dotenv').config();

// Crear pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Configuraciones adicionales para producción
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexión inactiva
  connectionTimeoutMillis: 2000, // Tiempo máximo para obtener conexión
});

// Evento cuando se conecta
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

// Evento cuando hay error
pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🕐 Hora del servidor de BD:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Función helper para ejecutar queries
const query = (text, params) => {
  return pool.query(text, params);
};

// Función helper para transacciones
const getClient = () => {
  return pool.connect();
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};