const express = require('express');
const mysql = require('mysql');
const cookieParser = require("cookie-parser");
const cors = require('cors')
require('dotenv').config();
const PORT = 5000;

// Express
const app = express()

// Cors
var corsOptions = {
    origin: process.env.CLIENT_URL,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(cors(corsOptions))

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// MySQL
var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});
connection.connect(() => {
    console.log('Connectez a la base de donnée');
});
global.connection = connection;

// Callback
const { showInfoSociety } = require("./controllers/society");
const { showHours } = require("./controllers/hours");
const { allCategories, showOneCategories, filterServices, allCategoriesExeptOne } = require("./controllers/services");

// Route API
app.get('/api/society', showInfoSociety); // Show all info society
app.get('/api/hours', showHours); // Show hours of society
app.get("/api/categories", allCategories); // Show all categories
app.get("/api/categories/:category", showOneCategories); // Show one categories
app.get("/api/categories/exept/:category", allCategoriesExeptOne)
app.get("/api/services/:category", filterServices); // Filter services by category

// Server
app.listen(PORT, () => {
    console.log(`API tourne sur le port ${PORT}`);
})