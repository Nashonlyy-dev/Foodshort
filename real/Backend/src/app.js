const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const feedRoutes = require('./routes/foodfeed.routes');
const placeOrderRoutes = require('./routes/placeorder.routes');
const cors = require('cors');
    

const app = express();
app.use(cors({
    origin: 'https://foodshort-1.onrender.com',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.send("Hello World");
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/order', placeOrderRoutes);


module.exports = app
