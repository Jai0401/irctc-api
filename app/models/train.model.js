// app/models/train.model.js
module.exports = (sequelize, DataTypes) => {
    const Train = sequelize.define('Train', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalSeats: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
      getterMethods: {
          availableSeats() {
              return this.totalSeats - (this.Bookings ? this.Bookings.length : 0);
          },
      },
    }
    );

    return Train;
};