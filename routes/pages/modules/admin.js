const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/pages/admin-controller')
const categoriesController = require('../../../controllers/pages/category-controller')
const upload = require('../../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:rest_id/edit', adminController.editRestaurant)
router.get('/restaurants/:rest_id', adminController.getRestaurant)
router.put('/restaurants/:rest_id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:rest_id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.put('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.get('/categories/:id', categoriesController.getCategories)
router.put('/categories/:id', categoriesController.putCategory)
router.delete('/categories/:id', categoriesController.deleteCategory)
router.get('/categories', categoriesController.getCategories)
router.post('/categories', categoriesController.createCategories)

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
