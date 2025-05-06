require('dotenv').config({path: '.env'});
const cors = require('cors');
const moment = require("moment");

const { products } = require('./V1/model/index.js');

console.log("SECRET_KEY:", process.env.SECRET_KEY);

const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require("node-cron");
// const { connect } = require('./backend/V1/api');
const app = express();
const path = require("path");
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    "https://earnest-pithivier-99c33c.netlify.app",
    "http://localhost:5173",
    undefined
  ];
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }));
  app.use((req, res, next) => {
    console.log("Request origin:", req.headers.origin);
    next();
  });
  
app.options("*", cors());

const connDB = async()=>{

    try {      
        await mongoose.connect(process.env.MONGO_URI,{
            dbName: 'test'  
        });
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

cron.schedule("0 0 * * *",async()=>{
    try {
        const todayUTC = moment().startOf("day").toDate()
        console.log("today's UTC date:", todayUTC);
        
        const expiredProducts = await products.find({expiryDate: {$lt: todayUTC}});
        console.log("Expired products", expiredProducts);
        
        if(expiredProducts.length > 0){
            const result = await products.deleteMany({expiryDate: {$lt: todayUTC}});
            console.log(`Manually deleted ${result.deletedCount} expired products`);
        }else{
            console.log("No expired products found");
        }
    } catch (error) {
        console.log("Error deleting expired products", error);     
    }
},{
    "timezone": "Asia/Kolkata",
});

connDB();   
// app.set('db', require('../models/index.js'));
const router = require("./V1/router/index.js");

const categoryRoutes = require('./V1/router/api/category.router.js');
app.use('/api/v1/category', categoryRoutes);

// console.log("Router file loaded");

// require("./backend/V1/model");

// app.use('/api', require('./backend/V1/router')); 
app.use("/api/v1", router);
app.use("/uploads", express.static(path.join(__dirname,"/uploads")));

app.listen(process.env.DEV_APP_PORT || 8081, () => {
    console.log(`Server running at http://localhost:${process.env.DEV_APP_PORT || 8081}`);
});

