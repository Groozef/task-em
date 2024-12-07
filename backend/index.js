require("dotenv").config();
const express = require("express");
const cors = require('cors');
const pool = require('./services/db');
const stockRoutes = require('./routes/products.routes'); 


const app = express();
const PORT = process.env.PORT || 4242;

// middleware
app.use(cors());  // from another domain()
app.use(express.json());  // for parsing json data to JS object

// Тестовый маршрут
app.get("/", async (_, res) => {
    
    const client = await pool.connect();
    const result = await client.query('SELECT version()'); // postgres version 17
    client.release();
    
    res.json({ version: result.rows[0].version });

});
app.use(stockRoutes);

app.use((req, res, next) => {
    console.log(req.method, req.url); 
    next();
});


app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});