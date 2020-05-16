const express = require('express');
const projectDB = require('./data/helpers/projectModel');


const router = express.Router();

router.get('/', (req,res)=>{
    projectDB.get()
    .then(projectList => res.status(200).json(projectList))
    .catch(()=>{res.status(500).json({message:"error in getting project list from database"})})
})

router.post('/', validateProject, (req,res)=>{
    projectDB.insert(req.body)
    .then(project=>{res.status(201).json(req.body)})
    .catch(()=>{res.status(500).json({message:'error in posting new project to database'})})
})

router.put('/:id', validateProject, validateProjectId, (req,res)=>{
    const changes = req.body;
    projectDB.update(req.params.id, changes)
    .then(project=>{
        res.status(200).json(changes)
    })
    .catch(()=>{res.status(500).json({message:"error in updating project to database"})})
})

router.get('/:id', validateProjectId, (req,res)=>{
    projectDB.get(req.params.id)
    .then(project =>{
        res.status(200).json(project)
    })
    .catch(()=>{res.status(500).json({message:"error in getting project by that ID"})})
})

function validateProject(req,res,next) {
    if(!req.body){
        res.status(400).json({message:"missing project information"})
    } else if(!req.body.name){
        res.status(400).json({message:"missing project name field"})
    } else if(!req.body.description){
        res.status(400).json({message:"missing project description field"})
    }else {
        next();
    }
}
function validateProjectId(req,res,next) {
    const{id} = req.params;
    projectDB.get(id)
    .then(project =>{
        if(!project){
            res.status(404).json({message:"the project you ar elooking for does not exist"})
        } else {
            next();
        }
    })
    .catch(()=>{res.status(500).json({message:"database error in validating project id"})})
}



module.exports = router;