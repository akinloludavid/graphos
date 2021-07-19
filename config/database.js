const mongoose = require('mongoose')
require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI
const connectDB = async () =>{
  try{
    const connect = await mongoose.connect(MONGO_URI,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
      useCreateIndex:true,
      useFindAndModify:false
    })
    console.log('Connected to', connect.connection.host)
  }catch(err){
    console.log(err.message)
  }
}

module.exports = connectDB