module.exports = (sequelize, Sequelize) => {
    const Card = sequelize.define('card', {
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        productId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'product',
                key: 'id'
            }
        },
        count: {
            type: Sequelize.INTEGER,
            defaultValue:1,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },


    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return Card
} 