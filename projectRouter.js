const express = require('express');
const projectDB = require('./data/helpers/projectModel');
const actionsDB = require('./data/helpers/actionModel');


const router = express.Router();

//get a list of all projects
router.get('/', (req,res)=>{
    projectDB.get()
    .then(projectList => res.status(200).json(projectList))
    .catch(()=>{res.status(500).json({message:"error in getting project list from database"})})
})

//post a new project 
router.post('/', validateProject, (req,res)=>{
    projectDB.insert(req.body)
    .then(project=>{res.status(201).json(req.body)})
    .catch(()=>{res.status(500).json({message:'error in posting new project to database'})})
})

//get project and action array of current id
router.get('/:id', validateProjectId, (req,res)=>{
    projectDB.get(req.params.id)
    .then(project =>{
        res.status(200).json(project)
    })
    .catch(()=>{res.status(500).json({message:"error in getting project by that ID"})})
})

//edit project with current id
router.put('/:id', validateProject, validateProjectId, (req,res)=>{
    const changes = req.body;
    projectDB.update(req.params.id, changes)
    .then(project=>{
        res.status(200).json(changes)
    })
    .catch(()=>{res.status(500).json({message:"error in updating project to database"})})
})

//delete project of current id
router.delete('/:id', validateProjectId, (req,res)=>{
    projectDB.remove(req.params.id)
    .then(()=>{res.status(200).json({message:"that project has been removed"})})
    .catch(()=>{res.status(500).json({message:"there was an error in removing that project form the database"})})
})

//action get to current id project
router.get('/:id/actions', validateProjectId, (req,res)=>{
    projectDB.get(req.params.id)
    .then(project =>{
        if(project.actions.length>0){
            res.status(200).json(project.actions)
        }else {res.status(400).json({message:"this project does not have any actions"})}
    })
    .catch(()=>{res.status(500).json({message:"error in getting project by that ID"})})
})

//action post to current id project
router.post('/:id/actions',validateProjectId, validateAction,(req,res)=>{
    const {id} = req.params;
    let newAction = req.body;
    newAction.project_id = id;

    actionsDB.insert(req.body)
    .then(action=>{res.status(201).json(action)})
    .catch(()=>{res.status(500).json({message:"error in posting new action to database"})})

})


//middleware validations
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

function validateAction(req,res,next){
    if(!req.body){
        res.status(400).json({message:"missing action information"})
    } else if(!req.body.description){
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