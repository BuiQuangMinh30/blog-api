const router = require('express').Router();
const Category = require('../models/Category')

router.post('/', async(req, res)=> {
    const newCategory = new Category(req.body);
    try{
        const saveCategory  = newCategory.save();
        res.status(200).json("Create category successfully")
    }catch(err){
        res.status(500).json({error: err});
    }
})


router.get('/', async(req,res)=> {
    try{
        const cats = await Category.find();
        res.status(200).json(cats);
    }catch(err){
        res.status(500).json({error: err});
    }
})

module.exports = router;