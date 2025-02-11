// app/models/booking.model.js
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
      bookingDate: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
      },
    });
    return Booking;
};