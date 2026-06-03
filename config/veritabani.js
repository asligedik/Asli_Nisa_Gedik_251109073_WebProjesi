const mysql = require('mysql2/promise');
const ayarlar = require('./ayarlar');

// Hocam pool kullandim, her API isteginde yeni baglanti acmayalim diye
const havuz = mysql.createPool({
  host: ayarlar.db.host,
  user: ayarlar.db.user,
  password: ayarlar.db.password,
  database: ayarlar.db.database,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = havuz;
