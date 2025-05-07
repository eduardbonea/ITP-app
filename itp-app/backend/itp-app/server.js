const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Configuration
const sequelize = new Sequelize('itp-app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false // Set to true for SQL query logging
});

// Define Booking Model
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

// Routes
// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, surname, phone, email, date, service } = req.body;
    
    // Validate inputs
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

// Get a specific booking by ID
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

// Update a booking
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

// Delete a booking
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

// Initialize database and start server
(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();