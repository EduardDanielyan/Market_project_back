module.exports = (sequelize, Sequelize) => {
    const Order_details = sequelize.define('order_details', {
        order_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'orders',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        productId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'product',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        count: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        feedback: {
            type: Sequelize.STRING,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return Order_details
}