// add middlewares here related to actions

//model
const Actions = require('./actions-model')

function logger(req, res, next) {
    console.log('logger mw:', logger);
    const timestamp = new Date().toLocaleString()
    // method - get,put, etc. are inside req.method
    const method = req.method
    // url - can find it in many places, one way below
    const url = req.originalUrl
    console.log(`[${timestamp} ${method} to ${url}]`)
    next()
  }

  async function validateActionsId(req, res, next){
    try{
        console.log('req.params.id: Actions', req.params.id)
        const actions = await Actions.get(req.params.id)
        if (!actions){
            next({
                status: 404, 
                message: `Actions with id:${req.params.id} not found`
            })
        } else {
            req.actions = actions
            next()
        }
    }catch(err){
        res.status(500).json({
            message: "problem finding project"
        })
    }
}

//project_id
//number	
//required, must be the id of an existing project
function validateProjectsId(req, res, next){
    // console.log('LOOK', req.body)
    const { projectId } = req.body;
    if (!projectId && projectId == validateActionsId){
    next({
        status: 400,
        message: "missing project_id field"
    })
    } else {
        req.project_id = projectId
        next()
    }
}
function validateActionsInfo(req, res, next){
    const { description } = req.body;
    const minLength=128;
    if (!description || !description.trim() || description.length < minLength){
        next({
            status: 400,
            message: "missing description field"
        })
    } else {
        req.description = description.trim()
        next()
    }
}
function validateActionsNotes(req, res, next){
    const { notes } = req.body;
    if (!notes || !notes.trim()){
        next({
            status: 400,
            message: "missing notes field"
        })
    } else {
        req.notes = notes.trim()
        next()
    }
}
function validateActionComplete(req, res, next){
    if (!validateProjectsId && !validateActionsInfo){
    next({
        status: 400,
        message: "MW: missing COMPLETED field",
        // completed: false
    })
    } else {
        req.completed = true
        next()
    }
}



  module.exports = {
    logger,
    validateActionsId,
    validateProjectsId,
    validateActionsInfo,
    validateActionsNotes,
    validateActionComplete
  } 