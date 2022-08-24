const bcrypt = require('bcrypt')
const async = require('hbs/lib/async')
const salt = 10
const { User } = require('../models')


class AuthController {

    home(req, res) {
        res.redirect('/registration')
    }

    add(req, res) {
            console.log(req.body)
            let data = req.body.data
            let error = false
            if (data.password != data.password_confirm) {
                error = true
            return  alert('dont cnfirm')
            }
            if (!error) {
                delete data.password_confirm
                bcrypt.hash(data.password, salt, function (err, hash) {
                    // Store hash in your password DB.
                    data.password = hash
                    console.log(data);
                    User.create(data)
                    res.redirect('/registration')

                })
            }
    }

    
 

}


module.exports = {
    AuthController: new AuthController
}