const NodeCache = require('node-cache')

const myCache = new NodeCache({stdTTL:100, checkperiod:600})
const {BlogModel} = require('../models/blogModel')
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer');

exports.getAllPosts = async (req,res)=>{
  try{
    if(myCache.has('blogs')){
      const cachedBlogs = myCache.get('blogs')
      return res.json({success:true, posts: cachedBlogs})
    }
    const allBlogs = await BlogModel.find({}).sort({createdAt: -1})

    myCache.set('blogs', allBlogs)
    return res.status(200).json({
      success:true,
      posts:allBlogs
    });

  }catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getCurrentUserPosts = async (req,res)=>{
  try {
    const currentUser = req.user;
    const allBlogs = await BlogModel.find()
    const currentUserPosts= allBlogs.filter(blog => blog.creator?.ID ===req.params.id)
    return res.status(200).json({
      success: true,
      posts: currentUserPosts
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      error:error.message
    })
  }
}

exports.getOnePost = async (req,res) =>{
  const {id} = req.params
  try {
    const blog = await BlogModel.findById(id)
    
    return res.status(200).json({
      success:true,
      post:blog
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: err.message,
      status:'error'
    })
  }
}

exports.createPost = async (req, res)=>{
  try {
    const blog = {
      title:req.body.title,
      subtitle:req.body.subtitle,
      content:req.body.content,
      tags:req.body.tags
    }
    const currentUser = req.user
    const author={};
    author.username= currentUser.username;
    author.email = currentUser.email
    author.ID = currentUser._id
    blog.creator = author

    const newBlog = await BlogModel.create(blog);

    return res.status(200).json({
      success:true,
      post: newBlog
    })
   } catch (error) {
    return res.status(500).json({
      message:error.message,
      status:'error'
    })
  }
}

exports.editPost = async (req, res)=>{
  try{
    const currentUser = req.user;
    console.log(currentUser)
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: 'not found',
        success: false
      })
    }

    if(String(currentUser._id) !== blog.creator.ID){
      return res.status(403).json({
        message:"Unauthorized",
        success:false
      })
    }
    const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      tags: req.body.tags
      }, 
      {new: true}
    );

    const newBlog = await updatedBlog.save()
    return res.status(200).json({
      success:true,
      post:newBlog
    })
  }catch(err){
    return res.status(500).json({
      status:'error',
      message:err.message
    })
  }

}


exports.likePost = async (req,res) => {
  try{

    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Not found',
       
      })
    }
  
    if(!blog.likes.includes(String(req.user._id))){
      blog.likes.push(String(req.user._id))
      blog.likesCount = blog.likes.length
      await blog.save()
      return res.status(200).json({
        message:'You liked this post',
        status:'success',
        success:true,
        blog
      })
    }
    else {
      const index = blog.likes.indexOf(String(req.user._id));
      blog.likes.splice(index,1)
      blog.likesCount = blog.likes.length
      await blog.save()
      return res.status(200).json({
        message: 'You unliked this post',
        status: 'success',
        success: true,
         blog
      })
    }
  }catch(error){
    return res.status(500).json({
      success:false,
      message:error.message,
      status:'error'
    })
  }
}


exports.deleteOnePost = async (req,res)=>{
  try{
    const currentUser = req.user;

    const blog =  await BlogModel.findById(req.params.id)
    if(!blog){
      return res.status(404).json({
        success:false,
        message:'Not found'
      })
    }
    if (String(currentUser._id) !== blog.creator.ID) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false
      })
    }
    await BlogModel.deleteOne({_id:req.params.id})
    return res.status(200).json({
      message:"successfully deleted",
      success:true
    })
  }catch(err){
    return res.status(500).json({
    message:err.message,
    status:'error'
    })
  }
}


exports.bookMarkPost = async (req, res)=>{
  try {
    const currentUser = req.user;
    const blog = await BlogModel.findById(req.params.id);
    if(!blog.bookmarks.includes(currentUser._id)){
      blog.bookmarks.push(currentUser._id)
      await blog.save()
      return res.status(200).json({
        message:'post bookmarked',
        success:true,
        post:blog
      })
    }else {
      const index = blog.bookmarks.indexOf(currentUser._id);
      blog.bookmarks.splice(index)
      await blog.save();
      return res.status(200).json({
        message: 'post unmarked',
        success: true,
        post: blog
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 'error'
    })
  }
}
exports.deletePosts = async (req,res)=>{

}
