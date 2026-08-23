import mysql from 'mysql2';

// Only load dotenv locally if not in production
if (process.env.NODE_ENV !== 'production') {
    // Next.js automatically loads .env.local, but keeping this is safe
}

console.log('🔍 Checking DB Config -> Host:', process.env.DB_HOST ? 'Loaded ✅' : 'MISSING ❌');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'sketch-tea-db-sketch-tea.f.aivencloud.com',
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    port: process.env.DB_PORT || 27262,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database Connection Error:', err.message);
    } else {
        console.log('✅ Successfully connected to MySQL Database!');
        connection.release();
    }
});

export default pool.promise();