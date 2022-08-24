const express = require("express")
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')

const multer = require('multer')
const cors = require('cors')
const { User, Card , Orders , Order_details} = require('./models');
const async = require("hbs/lib/async");
const { AuthController } = require("./Controllers/AuthController")
const { UserController } = require('./Controllers/UserController')
const { OrderController } = require('./Controllers/OrderController')
const { authenticationMiddleware } = require("./middleware/User")
const app = express()
const server = require('http').createServer(app);

const stripe = require('stripe')("sk_test_51KlAKFKWCDQtSq8jjZO8PFE8ghSHIusvv52VZ1kk5rD1XxvfqMHA0TIFBmkoH0ECp8jrHiAKOdJE8CJC5TepWexM007o6YbaSQ")
const uuid = require('uuid')

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
  }
});

io.on('connection', () => (socket) => {
  console.log('a user connetcted');
  socket.emit('FromAPI', { data: 'Edo' })

  socket.on('H1', function (data) {
    console.log(data);
  })
});


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  }))
  
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/Static"))
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(
  async function (username, password, done) {
    let user = await User.findOne({ where: { email: username } });
    if (!user) { return done(null, false); }
    bcrypt.compare(password, user.password).then(function (result) {
      console.log(result);
      if (!result) { return done(null, false); }
      return done(null, user);
    });
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let user = await User.findByPk(id)
  done(null, user);
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/images')
  },
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })


//******************************************//

app.post('/registration', AuthController.add)

app.post('/signin', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (user) {
      req.logIn(user, (err) => {
        if (err) {
          res.send({ error: 'Somthing wrong' })
        }
        console.log(req.user);
        res.send({ status: 'ok' })
      })
    }
    else {
      res.send({ error: 'User not found' })
    }
  })(req, res, next)
})

app.post("/profile", UserController.profile)
app.post('/logout', UserController.logOut)
app.post('/addProduct', upload.array('photo'), UserController.addProduct)
app.post('/myProduct', authenticationMiddleware(), UserController.showProduct)
app.post('/productInfo', authenticationMiddleware(), UserController.myProduct)
app.post('/allProducts', UserController.allProducts)
app.post('/addCard', authenticationMiddleware(), UserController.cardAdd)
app.post('/showCard', authenticationMiddleware(), UserController.cardShow)
app.post('/removeProd', authenticationMiddleware(), UserController.removeProduct)
app.post('/orderProducts', authenticationMiddleware(), OrderController.ordProduct)
app.post('/orderTable', OrderController.ordTable)
app.post('/details', OrderController.details)
app.post('/userCheck', async function (req, res) {
  if (req.user) {
    res.send('true')
  }
  else {
    res.send('false')
  }
})

app.post('/paymant',async (req, res) => {
  const { product, token } = req.body;
  console.log(req.user);
  const card = await Card.findAll({
    where: {
      user_id: req?.user?.id,
    },
    include: { all: true, nested: true },
  });
  let total = 0;
  card.forEach((el) => (total += el.count * el.product.price));

  const idempontencyKey = uuid.v4();
  stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) =>
      stripe.charges.create({
        amount: total * 100,
        currency: "usd",
        customer: customer.id,
      })
    )
    .then(async () => {
      await Card.destroy({
        where: { user_id: req?.user?.id },
      });

      let order = await Orders.create({
        users_id: req?.user?.id,
        total: total,
      });
      cart.forEach(async (el) => {
        el.product.count -= el.count;
        el.product.save();
        await Order_details.create({
          order_id: order.id,
          product_id: el.product.id,
          count: el.count,
          feedback: "",
        });
      });
      console.log(req.body);
      let allcards = await Card.findAll({
        where: { user_id: req?.user?.id },
        include: { all: true, nested: true },
      });
      res.send({ allcards });
    })
    .catch((err) => console.log(err));
})


server.listen(4000)

