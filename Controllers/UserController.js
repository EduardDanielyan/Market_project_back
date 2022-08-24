const async = require('hbs/lib/async')
const { User, Product, Photo, Card } = require('../models')


class UserController {

    profile(req, res) {
        console.log(req.user);
        res.send({ user: req.user })
    }

    logOut(req, res) {
        req.logout()
        res.send('ok')
    }

    async addProduct(req, res) {
        let p = await Product.create({
            name: req.body.name,
            count: req.body.count,
            price: req.body.price,
            description: req.body.description,
            userId: req.user.id
        })

        console.log(p);
        req.files.forEach(async (el) => {
            await Photo.create({
                url: el.filename,
                productId: p.id
            })
        })
        console.log(req.body);
        console.log(req.files);
        console.log(req.user.id);
    }

    async showProduct(req, res) {
        let prod = await Product.findAll({ where: { userId: req.user.id }, include: Photo })
        console.log(prod);
        res.send(prod)
    }

    async myProduct(req, res) {
        let prodInfo = await Product.findOne({ where: { id: req.body.id }, include: Photo })
        console.log('okkkkk')
        res.send(prodInfo)
    }

    async allProducts(req, res) {
        let allProd = await Product.findAll()
        res.send(allProd)
    }

    async cardAdd(req, res) {
        let add = await Card.findOne({
            where: {
                user_id: req.user.id,
                productId: req.body.id,
            }
        })
        if (!add) {
            Card.create({
                user_id: req.user.id,
                productId: req.body.id,
            })
        }
        else {
            Card.update({
                count: add.count + 1
            }, {
                where: {
                    user_id: req.user.id,
                    productId: req.body.id,
                }
            })
        }
        console.log(add);
        res.send(add)
    }


    async cardShow(req, res) {
        let info = await Card.findAll({ where: { user_id: req.user.id }, include: { all: true, nested: true } })
        console.log(info, '55555');
        res.send(info)

    }

    async removeProduct(req, res) {
        let del = await Card.destroy({ where: { id: req.body.id } })
        console.log(del);
        res.send({ del })
    }

    

    

}

module.exports = {
    UserController: new UserController
}