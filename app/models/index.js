// app/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect,
        logging: false,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, DataTypes);
db.Train = require('./train.model')(sequelize, DataTypes);
db.Booking = require('./booking.model')(sequelize, DataTypes);

// Associations
db.User.hasMany(db.Booking, { foreignKey: 'userId' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId' });
db.Train.hasMany(db.Booking, { foreignKey: 'trainId' });
db.Booking.belongsTo(db.Train, { foreignKey: 'trainId' });


(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');

    const adminExists = await db.User.findOne({ where: { isAdmin: true } });
    if (!adminExists) {
      const hashedPassword = await require('bcryptjs').hash('admin_password', 10);
      await db.User.create({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true,
      });
      console.log("Default admin user created with username 'admin' and password 'admin_password'. Change this immediately!");
    }


  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();



module.exports = db;