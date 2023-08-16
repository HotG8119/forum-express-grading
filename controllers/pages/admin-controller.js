const { Restaurant, User, Category } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const adminServices = require('../../services/admin-services')

const ADMIN_EMAIL = 'root@example.com'

const restaurantController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, date) => err ? next(err) : res.render('admin/restaurants', date))
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => {
        return res.render('admin/create-restaurant', { categories })
      }).catch(err => { next(err) })
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.rest_id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => console.log(err))
  },
  editRestaurant: async (req, res) => {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.rest_id, { raw: true }),
        Category.findAll({ raw: true })
      ])

      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) {
      console.log(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) {
        throw new Error('Restaurant name is required!')
      }

      const { file } = req

      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(req.params.rest_id),
        imgurFileHandler(file)
      ])

      if (!restaurant) {
        throw new Error("Restaurant didn't exist!")
      }

      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image,
        categoryId
      })

      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      return res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
      .catch(err => console.log(err))
  },
  patchUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === ADMIN_EMAIL) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
module.exports = restaurantController
