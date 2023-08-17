const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin.js')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

const restController = require('../../controllers/apis/restaurant-controller.js')
const userController = require('../../controllers/apis/user-controller.js')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.get('/restaurants', restController.getRestaurants)

router.use('/', apiErrorHandler)

module.exports = router
