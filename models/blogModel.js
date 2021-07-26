const mongoose = require('mongoose')
const Owner = new mongoose.Schema({
  username:{
    type:String
  },
  ID:{
    type:String
  },
  email:{
    type:String
  }
})

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  subtitle:{
    type:String,
  },
  content:{
    type:String,
    required:true
  },
  tags:{
    type:String
  },
  likesCount:{
    type:Number,
    default:0
  },
  likes:[
    {
      type:String
    }
  ], 
  creator:{
    type:Owner
  },
  bookmarks:{
    type:[String]
  }, 
  blogImage:{
    type:String
  },
  cloudinary_id: {
    type: String,
  },

}, {timestamps:true})

const BlogModel = mongoose.model('Blog', blogSchema)

module.exports = {BlogModel}