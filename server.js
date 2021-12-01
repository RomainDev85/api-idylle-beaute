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
    // origin: [process.env.FIRST_CLIENT_URL, process.env.SECOND_CLIENT_URL],
    origin: process.env.FIRST_CLIENT_URL,
    credentials: true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//MySQL
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});
global.pool = pool;

// Middleware
const { checkUser, requireAuth } = require("./middleware/auth");

// Callback
const { showInfoSociety } = require("./controllers/society");
const { showHours } = require("./controllers/hours");
const { allCategories, showOneCategories, filterServices, allCategoriesExeptOne, showLittleCategories, serviceLittleCategory } = require("./controllers/services");
const { createUser, login, logout } = require("./controllers/authentification");

// JWT
app.get('*', checkUser);
app.get('/jwt', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user)
})

// Route API
app.get('/api/society', showInfoSociety); // Show all info society
app.get('/api/hours', showHours); // Show hours of society
app.get("/api/categories", allCategories); // Show all categories
app.get("/api/categories/:category", showOneCategories); // Show one categories
app.get("/api/categories/exept/:category", allCategoriesExeptOne)
app.get("/api/categories/littlecategory/:category", showLittleCategories) // Show little categories of one category
app.get("/api/services/:category", filterServices); // Filter services by category
app.get("/api/services/littlecategory/:idCategory", serviceLittleCategory) // Show services of little category
app.post("/api/create/user", createUser) // Create user
app.post("/api/login", login) // Login admin
app.get("/api/logout", logout) // Logout admin

// Server
app.listen(PORT, () => {
    console.log(`API tourne sur le port ${PORT}`);
})