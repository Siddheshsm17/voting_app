const express = require('express');
const app = express();
const db = require('./db');

require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 6000 ; 



// import router files 

const userRoutes = require('./routes/userRoutes');

// use the routes 
app.use('/User',userRoutes );

app.listen(PORT ,()=>{
    console.log('listening on port 6000');
})

