// npm install twilio node-cron dotenv

const twilio = require('twilio');
const cron = require('node-cron');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Twilio credentials (store these in a .env file in production)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Database Configuration (using the same config as your main app)
const sequelize = new Sequelize('itp-app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false
});

// Define Booking Model (same as in your main app)
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

// Format phone number to Romanian international format
const formatPhoneNumber = (phone) => {
  let phoneNumber = phone.trim();
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '+40' + phoneNumber.slice(1);
  } else if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+40' + phoneNumber;
  }
  return phoneNumber;
};

// Function to send SMS
const sendSMS = async (phone, message) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const smsMessage = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone
    });
    
    console.log(`SMS sent successfully to ${formattedPhone}. SID: ${smsMessage.sid}`);
    return smsMessage;
  } catch (error) {
    console.error(`Error sending SMS to ${phone}:`, error);
    throw error;
  }
};

// Function to check for bookings and send SMS for today
const checkAndSendSMSForToday = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Find all bookings for today
    const todayBookings = await Booking.findAll({
      where: {
        date: today
      }
    });
    
    console.log(`Found ${todayBookings.length} bookings for today (${today})`);
    
    // Send SMS for each booking
    for (const booking of todayBookings) {
      const message = `Bună ziua, vă așteptăm în data de ${booking.date} la stația ITP de la ${booking.service} cu autovehiculul ${booking.email}`;
      
      await sendSMS(booking.phone, message);
      console.log(`SMS sent to ${booking.name} ${booking.surname}`);
    }
    
    return todayBookings.length;
  } catch (error) {
    console.error('Error in check and send function for today:', error);
    return 0;
  }
};

// Function to check for upcoming bookings and send reminders
const checkAndSendReminders = async () => {
  try {
    // Get the date 3 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const reminderDate = futureDate.toISOString().split('T')[0];
    
    // Find all bookings for that date
    const upcomingBookings = await Booking.findAll({
      where: {
        date: reminderDate
      }
    });

    console.log(`Found ${upcomingBookings.length} bookings for ${reminderDate} (3 days ahead)`);

    // Send reminder SMS for each booking
    for (const booking of upcomingBookings) {
      const message = `Vă așteptăm la data de: ${booking.date} la statia ITP ${booking.service}. Acesta este un mesaj automat, vă rugăm nu răspundeți.`;

      await sendSMS(booking.phone, message);
      console.log(`Reminder SMS sent to ${booking.name} ${booking.surname}`);
    }
    
    return upcomingBookings.length;
  } catch (error) {
    console.error('Error in reminder function:', error);
    return 0;
  }
};

// Schedule task to run every day at 13:00 for 3-day-ahead reminders
cron.schedule('0 13 * * *', () => {
  console.log('Running reminder SMS task at 13:00');
  checkAndSendReminders();
});

// Function to manually trigger reminders for bookings 3 days ahead
const sendRemindersManually = async () => {
  console.log('Manually triggering reminders for bookings 3 days ahead');
  const messageCount = await checkAndSendReminders();
  console.log(`Sent ${messageCount} reminder messages for bookings 3 days ahead`);
  return messageCount;
};

// Function to manually send a test SMS
const sendTestSMS = async (phone) => {
  const testMessage = 'This is a test message from your ITP application.';
  return await sendSMS(phone, testMessage);
};

// Export functions for use in other parts of your application
module.exports = {
  sendSMS,
  checkAndSendSMSForToday,
  checkAndSendReminders,
  sendRemindersManually,
  sendTestSMS
};

// If this file is run directly, provide options to send messages
if (require.main === module) {
  (async () => {
    try {
      // Test database connection
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      
      // Get command line arguments
      const args = process.argv.slice(2);
      
      if (args.includes('--reminders') || args.includes('-r')) {
        // Send messages for bookings 3 days ahead
        const messageCount = await sendRemindersManually();
        console.log(`Script execution completed. Sent ${messageCount} reminders for bookings 3 days ahead.`);
        process.exit(0);
      } else if (args.includes('--service') || args.includes('-s')) {
        // Run as a service with PM2 - keep process alive for cron jobs
        console.log(`${new Date().toISOString()} - SMS service started with cron jobs active`);
        console.log(`Reminder cron job scheduled for 13:00 daily`);
        
        // Handle termination signals properly for PM2
        process.on('SIGINT', async () => {
          console.log('Received SIGINT. Closing database connection and exiting gracefully.');
          await sequelize.close();
          process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
          console.log('Received SIGTERM. Closing database connection and exiting gracefully.');
          await sequelize.close();
          process.exit(0);
        });
        
        // Log when cron jobs are activated
        cron.schedule('0 13 * * *', () => {
          console.log(`${new Date().toISOString()} - Running scheduled reminder task for bookings 3 days ahead`);
          checkAndSendReminders()
            .then(count => console.log(`${new Date().toISOString()} - Sent ${count} reminder messages`))
            .catch(err => console.error(`${new Date().toISOString()} - Error in scheduled reminder task:`, err));
        });
        
        // For PM2 monitoring
        setInterval(() => {
          console.log(`${new Date().toISOString()} - SMS service heartbeat`);
        }, 24 * 60 * 60 * 1000); // Log once per day
      } else {
        // Default: Send messages for today's bookings
        const messageCount = await checkAndSendSMSForToday();
        console.log(`Script execution completed. Sent ${messageCount} messages for today's bookings.`);
        process.exit(0);
      }
      
    } catch (error) {
      console.error('Error running twilio service:', error);
      // Only exit if not in service mode
      if (!process.argv.slice(2).includes('--service') && !process.argv.slice(2).includes('-s')) {
        process.exit(1);
      }
    } finally {
      // Only close the database connection if we're not in service mode
      if (!process.argv.slice(2).includes('--service') && !process.argv.slice(2).includes('-s')) {
        await sequelize.close();
      }
    }
  })();
}