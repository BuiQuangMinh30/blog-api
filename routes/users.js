const router = require('express').Router();
const User = require('../models/User')
const Post = require('../models/Post')
const bycypt = require('bcrypt');

//UPDATE
router.put('/:id', async (req, res) => {
    
        if(req.body.userId === req.params.id){
            if(req.body.password){
                const salt = await bycypt.genSalt(10);
                req.body.password = await bycypt.hash(req.body.password, salt);
                try{
                    const updateUser = await User.findByIdAndUpdate(
                        req.params.id,
                        {
                            $set: req.body,
                        },
                        {new: true}
                    );
                    res.status(200).json(updateUser);
                }catch(err){
                    res.status(500).json(err);
                }
            }
        }
    
})

//GET
router.get('/:id', async(req, res)=> {
    try{
        const user = await User.findById(req.params.id);
        const {password,...others}= user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(401).json(err);
    }
})


//DELETE 
router.delete('/:id', async(req, res)=> {
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findById(req.params.id);
            try{
                await Post.deleteMany({username: user.username});
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted");
            }catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(404).json("User not found!");
        }
    }else{
res.status(401).json("You can delete only your account!");
    }
})


module.exports = router;