const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',              
  password: '@admin-vaibhav-aran', 
  database: 'sync_aliva_db'     
});

db.connect((err) => {
  if (err) {
    console.log('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL DB ✅');
  }
});

module.exports = db;
