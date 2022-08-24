module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        name: {
            type: Sequelize.STRING
        },
        surname: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
       
    },
        {
            freezeTableName: true,
            timestamps: false
        })
    return User
} 