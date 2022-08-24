module.exports = (sequelize, Sequelize) => {
    const Orders = sequelize.define('orders', {
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        total: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return Orders
}