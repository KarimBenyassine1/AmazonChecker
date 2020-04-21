const express = require('express')
const router = express.Router()
const Info = require('../models/Info')
const mongoose=require('mongoose')

//GETS ALL DATA
router.get('/', async (req,res)=>{
    try{
        const data = await Info.find();
        res.json(data);
    }catch(err){
        res.json({message: err})
    }
})


//POSTS DATA
router.post('/', async (req,res)=>{
    console.log(req.body)
    const info = new Info({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        url: req.body.url,
        minPrice: req.body.minPrice
    })
    try{
    const savedInfo= await info.save();
    res.json(savedInfo)
    }catch(err){
        res.json({message: err})
    }

})


//GETS DATA FOR A SPECIFIC ID
router.get("/:infoId", (req,res,next)=>{
    const id = req.params.infoId;
    Info.findById(id)
    .exec()
    .then(doc =>{
        console.log("From Database:", doc)
        if(doc){
            res.status(200).json(doc)
        }else{
            res.status(404).json({message: 'no valid entry found'})
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports=router;