// actions router/endpoints
//returns an array of all the actions (that each project has?)

const express = require('express');
const Actions = require('./actions-model');
const router = express.Router();

const {
    validateActionsId,
    validateProjectsId,
    validateActionsInfo,
    validateActionsNotes,
    validateActionComplete
} = require('./actions-middlware');

router.get('/', (req, res, next) => {
    // RETURN AN ARRAY WITH ALL THE ACTIONS ALONE
    Actions.get()
        .then(actions => {
            res.json(actions)
        })
        .catch(next)
});


//sends back the action with given id
router.get('/:id', validateActionsId, (req,res) => {
    res.json(req.actions)
})


//post /
router.post('/', (req, res, next) => {
    //Returns the newly created project obj as the body of the response
    // console.log(req.name)
    // next()

    const { project_id, description, notes, completed } = req.body    

    if (!project_id || !description || !notes || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Missing or invalid request body fields' });
    }

    Actions.insert({
        project_id: project_id, 
        description: description,
        completed: completed,
        notes: notes
    })
    .then(newAction => {
        console.log('newAction:', newAction)
        res.status(201).json(newAction);
})
    .catch(next)
})


//put /:id
router.put('/:id', async(req, res, next)=>{
    const { id } = req.params;
    const { project_id, description, notes, completed } = req.body;

    if (!project_id || !description || !notes || typeof completed !== 'boolean'){
        return res.status(400).json({ error: "Missing notes, description, completed, or project_id" })
    }
    try{
        const updatedAction = await Actions.update(id, { project_id, description, notes, completed });

        if (updatedAction){
            res.status(200).json(updatedAction); // Respond with updated action
        } else {
            res.status(400).json({message: 'Action not found'})
        }
    } catch(err){
        res.status(500).json({err: "Error updating actions object"});
        next()
    }
})


//delete /:id
router.delete('/:id', async(req, res, next) => {
    //Returns no response body
    console.log('actions:', req.actions )
    try{
        await Actions.remove(req.params.id);
        res.json(req.actions)
    } catch(err){
        next(err)
    }
})






// ERROR HANDLING MW at the end of this route
router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
      customMessage: "something happened inside actions router",
      message: err.message,
      stack: err.stack,
    })
  })

module.exports = router;