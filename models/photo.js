module.exports = (sequelize, Sequelize) => {
    const Photo = sequelize.define('photo', {
        productId: {
            type:Sequelize.INTEGER,
            references: {
                model: 'product',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        url: {
            type: Sequelize.STRING,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
       
    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return Photo
} 