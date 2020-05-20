const express = require('express');
const actionsDB = require('./data/helpers/actionModel');
const projectDB = require('./data/helpers/projectModel');

const router = express.Router();



router.get('/', (req,res)=>{
    actionsDB.get()
    .then(actionsList =>{res.status(200).json(actionsList)})
    .catch(()=>{res.status(500).json({message:"error in getting actions list"})})
})

router.get('/:id', validateActionId, (req,res)=>{
    actionsDB.get(req.params.id)
    .then(action=>{res.status(200).json(action)})
    .catch(()=>{res.status(500).json({message:"error in getting action from database"})})
})

router.post('/', validateAction, (req,res)=>{
    actionsDB.insert(req.body)
    .then(action=>{res.status(200).json(action)})
    .catch(()=>{res.status(500).json({message:"there was an error in posting action to database"})})
})

router.put('/:id', validateActionId,validateAction, (req,res)=>{
    const {id} = req.params;
    const changes = req.body;

    actionsDB.update(id,changes)
    .then(()=>{res.status(201).json(changes)})
    .catch(()=>{res.status(500).json({message:"error in posting changes to action"})})
})

router.delete('/:id', validateActionId, (req,res)=>{
    actionsDB.remove(req.params.id)
    .then(()=>{res.status(200).json({message:"the action has been successfully deleted"})})
    .catch(()=>{res.status(500).json({message:"error in deleting action from database"})})
})

//middleware
function validateActionId(req,res,next){
    const {id} = req.params;
    actionsDB.get(id)
    .then(action=>{
        if(!action){
            res.status(404).json({message:"the action you are looking for does not exist"})
        } else {
            next();
        }
    })
    .catch(()=>{res.status(500).json({message:"database error in validating action id"})})
    
}

function validateAction(req,res,next){
    if(!req.body){
        res.status(400).json({message:"missing action information"})
    } else if(!req.body.project_id){
        res.status(400).json({message:"invalid or missing project_id"})
    }else if(!req.body.description){
        res.status(400).json({message:"missing action description"})
    } else if(req.body.description.length > 128){
        res.status(400).json({message:"description must be less than 128 characters"})
    } else if (!req.body.notes){
        res.status(400).json({message:"you must have notes field in an action post"})
    } else{
        next();
    }
}


module.exports = router;