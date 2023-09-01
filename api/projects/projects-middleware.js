// add middlewares here related to projects

//model
const Projects = require('./projects-model');

async function validateProjectId(req, res, next){
    try{
        const projects = await Projects.get(req.params.id)
        if (!projects){
            next({
                status: 404, 
                message: "project not found"
            })
        } else {
            req.projects = projects
            next()
        }
    }catch(err){
        res.status(500).json({
            message: "problem finding project"
        })
    }
}
function validateChanges(req, res, next){

}
function validatePost(req, res, next){

}

module.exports = {
    validateProjectId,
    validateChanges,
    validatePost
}