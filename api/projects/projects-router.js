// "projects" router/endpoints
const express = require('express');

//models
const Projects = require('./projects-model');

const router = express.Router();

//mw
const { 
    validateProjectId,
    validateProjectName,
    validateProjectInfo,
    validateProjectComplete
} = require ('./projects-middleware');


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

router.post('/', validateProjectName, validateProjectInfo, validateProjectComplete, (req, res, next) => {
    //Returns the newly created project obj as the body of the response -- // this needs a middleware to check that the request body is valid
    // console.log(req.name)
    // next()
    Projects.insert({
        name: req.name, 
        description: req.description,
        completed: req.completed
    })
    .then(newProject => {
        // console.log('newProject:', newProject)
        res.status(201).json(newProject);
})
    .catch(next)
})

router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, description, completed } = req.body; 
  
    if (!name || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Missing or invalid request body fields' });
    }

    try {
      // Update the project and fetch the updated project in a single step
      const updatedProject = await Projects.update(id, { name, description, completed });
  
      if (updatedProject) {
        res.status(200).json(updatedProject); // Respond with the updated project
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating project' });
      next()
    }
  });
  

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