const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  firstname:{
    type:String, 
    required:true
  },
  lastname:{
    type:String, 
    required:true
  },
  username:{
    type:String
  },
  bio:{
    type:String
  },
  email:{
    type:String,
    unique:true,
    lowercase:true,
    required:true
  },
  password:{
    type:String, 
    required:true
  }, 
  gender:{
    type:String,
    required:true,
    enum:{
      values: ['male', 'female']
    }
  },
  avatar:{
    type:String
  },
  cloudinary_id: {
    type: String,
  },
})
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
userSchema.methods.generateToken = function(){
  const token = jwt.sign({id:this._id, email:this.email}, JWT_SECRET_KEY,{
    expiresIn:'5d'
  })
  return token
}
const UsersModel = mongoose.model('Users', userSchema)
module.exports = {UsersModel}
