const { Card, Orders, Product, Order_details } = require("../models");

class OrderController{

    async ordProduct(req, res) {
        const card = await Card.findAll({
            where: {user_id: req?.user?.id},
            include: { all: true, nested: true }
        });
        let total = 0 ;
        card.forEach((el) => (total += el.count * el.product.price));
        card.forEach((el) => {
            el.product.count -=el.count
            el.product.save()
        })
        await Card.destroy({
            where: { user_id: req?.user?.id },
        });
        let order = await Orders.create({
            total: total,
            userId: req?.user?.id
        })
        res.send('okkkk')
        console.log(order);
    }

    async ordTable(req, res) {
        let order = await Orders.findAll({ where: { userId: req.user.id }, include: { all: true, nested: true } })
        console.log(order);
        res.send(order)
    }

    async details(req, res) {
       let details = await Order_details.create({where: {
           order_id: req.body.id,
    } ,include: { all: true, nested: true }})
       console.log(details,'details ok');
       res.send(details)
    }

    // async ordDetails(req,res) {
    //     let ordDet = await Order_details.update({where:{id: req.body.id}})
    // }
}

module.exports = {
    OrderController: new OrderController
}



