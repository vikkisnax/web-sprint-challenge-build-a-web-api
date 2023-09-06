// actions router/endpoints
//returns an array of all the actions (that each project has?)

const express = require('express');
const Actions = require('./actions-model');
const router = express.Router();

const {
    logger,
    validateActionsId,
    validateProjectsId,
    validateActionsInfo,
    validateActionsNotes
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

//put /:id

//delete /:id


// ERROR HANDLING MW at the end of this route
router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
      customMessage: "something happened inside actions router",
      message: err.message,
      stack: err.stack,
    })
  })

module.exports = router;