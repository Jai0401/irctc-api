const db = require('../models');
const { Sequelize } = require('sequelize');


async function bookSeat(userId, trainId) {
    const t = await db.sequelize.transaction();

    try {
        const train = await db.Train.findByPk(trainId, {
          include: [{ model: db.Booking }],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        
        if (!train) {
            await t.rollback();
            return [false, 'Train not found'];
        }
        
        const availableSeats = train.availableSeats
        if (availableSeats > 0) {
            await db.Booking.create({ userId, trainId }, { transaction: t });

            await t.commit();
            return [true, 'Booking successful'];
        } else {
            await t.rollback();
            return [false, 'No seats available'];
        }
    } catch (error) {
      console.log(error)
        await t.rollback();
        if (error instanceof Sequelize.UniqueConstraintError) {
            return [false, 'No seats available (booked concurrently)'];
        }
        return [false, 'An unexpected error occurred'];
    }
}

module.exports = { bookSeat };