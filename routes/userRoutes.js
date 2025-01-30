const express= require("express");
const router = express.Router();
const User = require('../models/User');
const {jwtAuthMiddleware , generateToken} = require('./../jwt');

router.post('/signup', async(req , res)=>{
    
    try{
        const data = req.body // assuming that request body contain person data
        

        // // create a new person document using mongoose model
         const newUser = new User(data);
         // save the new person to dtabase
         const response = await newUser.save();
         console.log('data saved');

         const payload ={

            id: response.id,
            username: response.username
         }
         console.log(JSON.stringify(payload));
         const token = generateToken(payload);
         console.log('token is :', token);
         res.status(200).json({response: response , token : token });
        
    }
    catch(err){

        console.log(err);
        res.status(500).json({error: " Internal server error  "});
    }

})
   
// router for login 
router.post('/login' , async (req , res)=>{
    try{
        // to extract username and password from req body 
        const { adharCardNumber, password}=req.body;
         // check if valid 
         if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        } 

        // find the user by user name 
        const user = await User.findOne({ adharCardNumber :  adharCardNumber});

        // if user does not exist or password does not match . return error 
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password "});
        }

        const payload={
            id:user.id,
            // username:user.username 
        }

        const token = generateToken(payload);

        res.json({token})

    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({error: " internal server error "});
    }

    

   
    
})

// get methid to get persons data 
router.get('/',  async(req , res)=>
{

    try{
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: " Internal server error  "});
    }
})








router.get('/:worktype', async(req ,res)=>{

   try{
        const worktype=req.params.worktype;// to extratct the work type from the url parameter
        if(worktype=="chef" || worktype=="manager" || worktype=="waiter"  ){
            const response = await Person.find({work:worktype});
            console.log('responss fetched');
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error:"invalid work type"});
        }

   }

   catch(err)
   {
    console.log(err);
            res.status(500).json({error: " Internal server error  "});
   }
});


router.put('/profile/password', jwtAuthMiddleware,async(req, res)=>{
    try{
        const userId= req.user;// to extract id from url 
        const {currentPassword , newPassword} = req.body; // updated data for the person
          
        const user = await User.findById(userId); // find user by id 

        if(!( await user.comparePassword(currentPassword))){
            return res.status(401).json({error:"Invalid username or password "});
        }
        user.password = newPassword;
        await user.save();

        console.log('passwaord updated');
        res.status(200).json({message:"Password updated"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: " Internal server error  "});
    }
});


// to delete id wise 

router.delete('/:_id', async(req, res)=>{
    try{
        const personId= req.params._id;// to extract id from url
        


        const response = await Person.findByIdAndDelete( personId ); 

        // if no response came or null response 
        if(!response)
        {
            return res.status(404).json({error : "person not found"});
        }

        console.log('data deleted');
        res.status(200).json({ message:"person deleted Successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: " Internal server error  "});
    }
});

module.exports= router;