const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
//define the person schema 

const UserSchema = new mongoose.Schema({

    name :
    {
        type: String,
        required : true 
    },
    age :{
        type: Number,
        required :true
        
    },

    email:{
       type: String
    },

    mobile:{
        type: String
    },

    address:{
        type:String,
        required:true
    },

    adharCardNumber :{
        type: Number ,
        required:true ,
        unique: true
    },

   password:{
    type:String,
    required:true
   },

   role:
   {
    type:String,
    enum:['voter' , 'admin'],
    default:'voter'
   },

   isVoted:{
    type:Boolean,
    default:false
   }


});

UserSchema.pre('save', async function (next) {
    // If the password has not been modified, skip hashing
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the salt
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (err) {
        return next(err);
    }
});


UserSchema.methods.comparePassword = async function(candidatePassword){

    try{
            const isMatch = await bcrypt.compare(candidatePassword , this.password);
            return isMatch;
    }catch(err)
    {
        throw err;
    }
}
 
 




const User = mongoose.model('User', UserSchema);
module.exports= User;