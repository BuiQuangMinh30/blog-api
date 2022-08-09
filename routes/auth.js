const router = require('express').Router();
const User = require('../models/User')

const bycypt = require('bcrypt');

//REGISTER
router.post("/register", async(req, res) => {
    console.log('req', req.body)
    try{
        const salt = await bycypt.genSalt(10);
        const hashedPass = await bycypt.hash(req.body.password, salt);

        const newUser = await User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
        console.log('err', err)
    }
});


//Login
router.post("/login", async(req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username})
        !user && res.status(400).json("Wrong credentials");

        const validated = await bycypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong credentials");

        const {password,... others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;