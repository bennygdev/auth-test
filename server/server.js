const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createClient } = require('redis');
const db = require('./models');
const passport = require('passport');
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: [
    process.env.CLIENT_BASE_URL,
  ], // vite server
};

// Redis
const redisClient = createClient({
  url: process.env.REDIS_URL
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

module.exports.redisClient = redisClient;

require('./config/passport'); 

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.get('/api', (req, res) => {
  res.json({'message': 'API is running'});
});

const PORT = process.env.PORT || 8080;

// Sync db and start server
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced.");
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});