module.exports = {
    HOST: "localhost",
    USER: "root", // Default MySQL username in Laragon
    PASSWORD: "", // Default MySQL password in Laragon is empty
    DB: "itp-app", // You need to create this database in Laragon
    dialect: "mysql",
    pool: {
      max: 5, // Maximum number of connections in pool
      min: 0, // Minimum number of connections in pool
      acquire: 30000, // Maximum time in ms to get a connection before throwing error
      idle: 10000 // Maximum time in ms that a connection can be idle before being released
    }
  };