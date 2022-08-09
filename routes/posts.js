const router = require('express').Router();
const Post = require('../models/Post')
const Category = require('../models/Category');
const { Router } = require('express');

// CREATE POST
router.post('/', async(req, res)=> {
    const post = new Post(req.body);
    try{
        const newPost = await post.save();
        res.status(200).json(newPost);
    }catch(err){
        res.status(500).json({error: err})
    }
})
// GET DETAIL POST
router.get('/:id', async(req, res)=> {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json({error: err})
    }
})

//GET ALL POSTS
router.get('/', async(req, res)=> {
    const username = req.query.user;
    const category = req.query.category;

    try{
        let posts;
        if(username){
            posts = await Post.find({username: username});
        }else if(category){
            posts = await Post.find({categories: {$in : [category]}});
        }else {
            posts = await Post.find();
          }
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json({error: err})
    }
})

//PUT 
router.put('/:id', async(req, res)=> {
    try{
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username){
            try{
                const updatePost = await Post.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body
                },
                {
                 new: true   
                })
                res.status(200).json(updatePost);
            }catch(err){
                res.status(404).json({error: err})
            }
        }
    }catch(err){
        res.status(500).json({error: err})
    }
})

//DELETE POST
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          await post.delete();
          res.status(200).json("Post has been deleted...");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can delete only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;