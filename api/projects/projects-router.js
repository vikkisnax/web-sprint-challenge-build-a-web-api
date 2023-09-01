// "projects" router/endpoints
const express = require('express');

//models
const Projects = require('./projects-model');

//mw
const { 
    validateProjectId,
    validateProjectName,
    validateProjectInfo
} = require ('./projects-middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
    // RETURN AN ARRAY WITH ALL THE PROJECTS (without their action posts)
    Projects.get()
        .then(projects => {
            res.json(projects)
        })
        .catch(next)
});

router.get('/:id', validateProjectId, (req, res) => {
    //Returns the project object - a project with the given id as the body of the response. - (project with their action posts)
    // this needs a middleware to verify user id
    // console.log(req.projects)
    res.json(req.projects)
    
})

router.post('/', validateProjectName, validateProjectInfo, (req, res, next) => {
    //Returns the newly created project obj as the body of the response.
    //this needs a middleware to check that the request body is valid
    // need req.name and req.info?
    // console.log(req.name)
    // next()
    Projects.insert({
        name: req.name,
        description: req.description
    })
    .then(newProject => {
        // throw new Error('ouch')
        res.status(201).json(newProject)
    })
    .catch(next)
})

router.put('/:id', validateProjectId, validateProjectName, validateProjectInfo, (req, res, next) => {
    //Returns the updated project obj as the body of the response.
    Projects.update(req.params.id, { name: req.name, description: req.description})
        .then(()=>{
            return Projects.get(req.params.id)
        })
        .then(project=>{
            res.json(project)
        })
        .catch(next)
})

router.delete('/:id', validateProjectId, async (req, res, next) => {
    //Returns no response body.
    // need mw to validate project id
    // console.log(req.projects)

    try{
        await Projects.remove(req.params.id);
        res.json(req.projects)
    } catch(err){
        next(err)
    }
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    //Returns an array of actions posts (could be empty) belonging to a project with the given id.
    // console.log(req.projects)

    try{
        const objActions = await Projects.getProjectActions(req.params.id)
        res.json(objActions)
    }
    catch(err){
        next(err)
    }
});

//get and edit actions posts inside actions router


// ERROR HANDLING MW at the end of this route
router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
      customMessage: "something happened inside projects router",
      message: err.message,
      stack: err.stack,
    })
  })

module.exports = router;
