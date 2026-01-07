const twilio = require("twilio");
const cron = require("node-cron");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,
  }
);

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "booking",
    timestamps: true,
  }
);

const formatPhoneNumber = (phone) => {
  let phoneNumber = phone.trim();
  if (phoneNumber.startsWith("0")) {
    phoneNumber = "+40" + phoneNumber.slice(1);
  } else if (!phoneNumber.startsWith("+")) {
    phoneNumber = "+40" + phoneNumber;
  }
  return phoneNumber;
};

const sendSMS = async (phone, message) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const smsMessage = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone,
    });

    console.log(
      `SMS sent successfully to ${formattedPhone}. SID: ${smsMessage.sid}`
    );
    return smsMessage;
  } catch (error) {
    console.error(`Error sending SMS to ${phone}:`, error);
    throw error;
  }
};

const checkAndSendSMSForToday = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const todaybooking = await Booking.findAll({
      where: {
        date: today,
      },
    });

    console.log(`Found ${todaybooking.length} booking for today (${today})`);

    for (const booking of todaybooking) {
      const message = `Bună ziua, vă așteptăm în data de ${booking.date} la stația ITP de la ${booking.service} cu autovehiculul ${booking.email}`;

      await sendSMS(booking.phone, message);
      console.log(`SMS sent to ${booking.name} ${booking.surname}`);
    }

    return todaybooking.length;
  } catch (error) {
    console.error("Error in check and send function for today:", error);
    return 0;
  }
};

const checkAndSendReminders = async () => {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const reminderDate = futureDate.toISOString().split("T")[0];

    const upcomingbooking = await Booking.findAll({
      where: {
        date: reminderDate,
      },
    });

    console.log(
      `Found ${upcomingbooking.length} booking for ${reminderDate} (3 days ahead)`
    );

    for (const booking of upcomingbooking) {
      const message = `Vă așteptăm la data de: ${booking.date} la statia ITP ${booking.service}. Acesta este un mesaj automat, vă rugăm nu răspundeți.`;

      await sendSMS(booking.phone, message);
      console.log(`Reminder SMS sent to ${booking.name} ${booking.surname}`);
    }

    return upcomingbooking.length;
  } catch (error) {
    console.error("Error in reminder function:", error);
    return 0;
  }
};

cron.schedule("0 13 * * *", () => {
  console.log("Running reminder SMS task at 13:00");
  checkAndSendReminders();
});

const sendRemindersManually = async () => {
  console.log("Manually triggering reminders for booking 3 days ahead");
  const messageCount = await checkAndSendReminders();
  console.log(
    `Sent ${messageCount} reminder messages for booking 3 days ahead`
  );
  return messageCount;
};

const sendTestSMS = async (phone) => {
  const testMessage = "This is a test message from your ITP application.";
  return await sendSMS(phone, testMessage);
};

module.exports = {
  sendSMS,
  checkAndSendSMSForToday,
  checkAndSendReminders,
  sendRemindersManually,
  sendTestSMS,
};

if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection established successfully.");

      const args = process.argv.slice(2);

      if (args.includes("--reminders") || args.includes("-r")) {
        const messageCount = await sendRemindersManually();
        console.log(
          `Script execution completed. Sent ${messageCount} reminders for booking 3 days ahead.`
        );
        process.exit(0);
      } else if (args.includes("--service") || args.includes("-s")) {
        console.log(
          `${new Date().toISOString()} - SMS service started with cron jobs active`
        );
        console.log(`Reminder cron job scheduled for 13:00 daily`);

        process.on("SIGINT", async () => {
          console.log(
            "Received SIGINT. Closing database connection and exiting gracefully."
          );
          await sequelize.close();
          process.exit(0);
        });

        process.on("SIGTERM", async () => {
          console.log(
            "Received SIGTERM. Closing database connection and exiting gracefully."
          );
          await sequelize.close();
          process.exit(0);
        });

        cron.schedule("0 13 * * *", () => {
          console.log(
            `${new Date().toISOString()} - Running scheduled reminder task for booking 3 days ahead`
          );
          checkAndSendReminders()
            .then((count) =>
              console.log(
                `${new Date().toISOString()} - Sent ${count} reminder messages`
              )
            )
            .catch((err) =>
              console.error(
                `${new Date().toISOString()} - Error in scheduled reminder task:`,
                err
              )
            );
        });

        setInterval(() => {
          console.log(`${new Date().toISOString()} - SMS service heartbeat`);
        }, 24 * 60 * 60 * 1000);
      } else {
        const messageCount = await checkAndSendSMSForToday();
        console.log(
          `Script execution completed. Sent ${messageCount} messages for today's booking.`
        );
        process.exit(0);
      }
    } catch (error) {
      console.error("Error running twilio service:", error);

      if (
        !process.argv.slice(2).includes("--service") &&
        !process.argv.slice(2).includes("-s")
      ) {
        process.exit(1);
      }

      if (
        !process.argv.slice(2).includes("--service") &&
        !process.argv.slice(2).includes("-s")
      ) {
        await sequelize.close();
      }
    }
  })();
}
