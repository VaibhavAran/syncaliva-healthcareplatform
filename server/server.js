const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Register User
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (result.length > 0) {
      return res.json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err) => {
        if (err) return res.json({ message: 'Signup failed' });
        return res.json({ message: 'Signup successful' });
      }
    );
  });
});

// Login User
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (result.length === 0) {
      return res.json({ success: false, message: 'Email not found' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.json({ success: true, user: { name: user.name, email: user.email } });
    } else {
      return res.json({ success: false, message: 'Incorrect password' });
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000 🚀');
});
