const {UsersModel} = require ('../models/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.createAccount = async (req,res)=>{
 
  try{

    const InputEmail = await UsersModel.findOne({email:req.body.email})
    if(InputEmail) return res.status(400).json({
      message:"User already exists",
      status:'error',
      success:false
    })

    let newUser = new UsersModel({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      password:req.body.password,
      gender:req.body.gender,
      username:req.body.email.split('@')[0]
    })
    // newUser.username = newUser.email.split('@')[0];
    const salt = await bcrypt.genSalt(12)
    newUser.password = await bcrypt.hash(newUser.password, salt)
    
    
    await UsersModel.create(newUser)
    return res.status(200).json({
      user:newUser
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 'error',
      success: false
    })
  }
}


exports.logIn = async (req,res)=>{
  try{
  // const user = {
  //   email:req.body.email,
  //   password:req.body.password
  // }
  const user = await UsersModel.findOne({email:req.body.email})
  if(!user){
    return res.status(404).json({
      status:'error',
      success:false,
      message:'User not found'
    })
  }

  const validpassword = await bcrypt.compare(req.body.password,user.password)
  if(!validpassword){
    return res.status(400).json({
      status:'error',
      message:'Invalid password or email',
      success:false
    })
  }
  const token = user.generateToken()

  return res.status(200).json({
    token,
    user
  })
  }
  catch(err){
    return res.status(500).json({
      message:err.message,
      status:'error',
      success:false
    })
  }
}