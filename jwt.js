const jwt = require('jsonwebtoken');
require('dotenv').config();

 const JWT_SECRET ="12345";


const jwtAuthMiddleware = (req , res , next)=>
{
    // to extract header from the request headers 
    const token = req.headers.authorization.split(' ')[1]; // to split beares keyword and actual token
    if(!token) return res.status(401).json({error : 'unauthorized'});

    try{
        // if token is present then verify token
        const decoded=jwt.verify(token ,JWT_SECRET);

        // attach user information to the request of object

        req.user = decoded
        next();

    }
    catch(err)
    {
        console.error(err);
        res.status(401).json({ error : 'Invalid token' });
    }
}



// function to generate token

const generateToken= (userData) =>{

    // generate a new JWT token using user data
    // const SECRET_KEY = '';
    //console.log(JWT_SECRET);
    return jwt.sign(userData , JWT_SECRET, {expiresIn: '1d'});
}

module.exports = {jwtAuthMiddleware , generateToken}


