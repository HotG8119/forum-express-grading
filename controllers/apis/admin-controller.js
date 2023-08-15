// const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, date) => err ? next(err) : res.json(date))
  }
}

module.exports = adminController
