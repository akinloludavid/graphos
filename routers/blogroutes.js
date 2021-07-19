const express = require('express')
const router = express.Router()
const {
  getAllPosts, 
  getOnePost, 
  createPost, 
  likePost, 
  editPost, 
  deleteOnePost, 
  deletePosts} = require('../controllers/blogController')
const {userAuth}= require('../middleware/authentication')

router.get('/allposts', userAuth, getAllPosts);
router.get('/posts/:id', userAuth, getOnePost);

router.post('/posts', userAuth, createPost);


router.put('/post/:id', userAuth, editPost)
router.put('/likepost/:id', userAuth, likePost);


router.delete('/post/:id', userAuth, deleteOnePost);
router.delete('/posts', userAuth, deletePosts)

module.exports= router