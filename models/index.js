const { Sequelize } = require('sequelize')
const config = require('../config/config')

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT
})

const User = require('./auth')(sequelize, Sequelize)
const Product = require('./product')(sequelize, Sequelize)
const Photo = require('./photo')(sequelize, Sequelize)
const Card = require('./card')(sequelize, Sequelize)
const Orders = require('./orders')(sequelize, Sequelize)
const Order_details = require('./order_details')(sequelize, Sequelize)

Product.hasMany(Photo)
Card.belongsTo(Product)
Photo.belongsTo(Product)
Card.belongsTo(Product)
User.hasMany(Product)
Orders.belongsTo(User)
Order_details.belongsTo(Product)
sequelize.sync()

module.exports = {
    User,
    Product,
    Photo,
    Card,
    Orders,
    Order_details
}
