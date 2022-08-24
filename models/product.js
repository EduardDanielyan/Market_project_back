module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
        name: {
            type: Sequelize.STRING,
        },
        count: {
            type: Sequelize.INTEGER,

        },
        price: {
            type: Sequelize.INTEGER,

        },
        description: {
            type: Sequelize.STRING,
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return Product
}