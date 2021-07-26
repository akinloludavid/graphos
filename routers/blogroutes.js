const express = require('express')
const router = express.Router()
const {
  getAllPosts, 
  getOnePost, 
  createPost, 
  likePost, 
  editPost, 
  deleteOnePost, 
  deletePosts,
  bookMarkPost,
  getCurrentUserPosts
} = require('../controllers/blogController');

const {userAuth}= require('../middleware/authentication')

router.get('/allposts', getAllPosts);
router.get('/posts/:id', getOnePost);
router.get('/currentuser/posts/:id', userAuth, getCurrentUserPosts)

router.post('/posts', userAuth, createPost);

router.put('/post/:id', userAuth, editPost)
router.put('/likepost/:id', userAuth, likePost);
router.put('/bookmark/:id',userAuth, bookMarkPost)

router.delete('/post/:id', userAuth, deleteOnePost);
router.delete('/posts', userAuth, deletePosts)

module.exports= router