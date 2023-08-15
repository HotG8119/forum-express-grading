const express = require('express')
const router = express.Router()
const admin = require('./modules/admin.js')

const restController = require('../../controllers/apis/restaurant-controller.js')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)

module.exports = router
