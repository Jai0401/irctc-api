const db = require('../models');
const { Op } = require('sequelize');


async function getAvailableTrains(source, destination) {
    return db.Train.findAll({
      where: {
        source,
        destination,
      },
      include: [{
        model: db.Booking,
        attributes: [],
      }],
    });
}

module.exports = { getAvailableTrains }