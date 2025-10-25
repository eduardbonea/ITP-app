require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const db = require('./models');
const Booking = db.Booking;
const User = db.User;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { name, surname, phone, email, date, service } = req.body;

    if (!name || !surname || !phone || !email || !date || !service) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const booking = await Booking.create({
      name,
      surname,
      phone,
      email,
      date,
      service
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { name, surname, phone, email, date, service } = req.body;

    await booking.update({
      name: name || booking.name,
      surname: surname || booking.surname,
      phone: phone || booking.phone,
      email: email || booking.email,
      date: date || booking.date,
      service: service || booking.service
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Only admins can log in.' });
    }

    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      password_hash: hashedPassword
    });

    res.status(201).json({ id: newUser.id, email: newUser.email });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    await db.sequelize.sync({ alter: true });
    console.log('Database synchronized');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('EROARE: Nu s-a putut realiza conexiunea la baza de date!');

    // Verificăm specific dacă e o eroare de conexiune refuzată
    if (error.name === 'SequelizeConnectionRefusedError' || error.original?.code === 'ECONNREFUSED') {
      console.error('   Motiv: Conexiune refuzată (ECONNREFUSED).');
      console.error('   Verifică dacă serverul tău MySQL este pornit.');
    
    // Verificăm dacă e o eroare de user/parolă
    } else if (error.name === 'SequelizeAccessDeniedError' || error.original?.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Motiv: Acces refuzat.');
      console.error('   SOLUȚIE: Verifică dacă userul și parola pentru baza de date sunt corecte.');

    // Verificăm dacă nu găsește host-ul (ex: 'localhost' e scris greșit)
    } else if (error.name === 'SequelizeHostNotFoundError' || error.original?.code === 'ENOTFOUND') {
        console.error(` Motiv: Host-ul bazei de date nu a fost găsit.`);

    } else {
      // Pentru orice alt tip de eroare
      console.error(`Motiv necunoscut: ${error.message}`);
      // Poți decomenta linia de mai jos dacă vrei să vezi eroarea completă în timpul depanării
      // console.error(error); 
    }

    console.log('\n Aplicația se va opri. Rezolvă problema și repornește serverul.');
    
    // Oprește procesul Node.js cu un cod de eroare
    process.exit(1); 
  }
})();