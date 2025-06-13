const bcrypt = require('bcrypt');
const { User, sequelize } = require('./models');
require('dotenv').config();

const seedDatabase = async () => {
  console.log('Starting the seeding process...');
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const userPassword = process.env.DUMMY_USER_PASSWORD;
    const modPassword = process.env.DUMMY_MOD_PASSWORD;
    const adminPassword = process.env.DUMMY_ADMIN_PASSWORD;

    if (!userPassword || !modPassword || !adminPassword) {
      console.error('Please set DUMMY_USER_PASSWORD, DUMMY_MOD_PASSWORD, and DUMMY_ADMIN_PASSWORD in your .env file.');
      return;
    }

    // Hash
    const salt = await bcrypt.genSalt(10);
    const hashedUserPassword = await bcrypt.hash(userPassword, salt);
    const hashedModPassword = await bcrypt.hash(modPassword, salt);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    // Users
    const users = [
      {
        first_name: 'User',
        last_name: '1',
        username: 'normaluser',
        email: 'user@example.com',
        password: hashedUserPassword,
        role: 'User',
      },
      {
        first_name: 'Moderator',
        last_name: '1',
        username: 'moduser',
        email: 'moderator@example.com',
        password: hashedModPassword,
        role: 'Moderator',
      },
      {
        first_name: 'Admin',
        last_name: '1',
        username: 'adminuser',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'Admin',
      },
    ];

    // Create users
    for (const userData of users) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      });

      if (created) {
        console.log(`Created user: ${user.email}`);
      } else {
        console.log(`User already exists, updated: ${user.email}`);
        await user.update(userData); // Optionally update existing user info if needed
      }
    }

    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
