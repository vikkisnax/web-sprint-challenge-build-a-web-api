// add middlewares here related to projects

//model
const Projects = require('./projects-model');

async function validateProjectId(req, res, next){
    try{
        console.log('req.params.id:', req.params.id)
        const projects = await Projects.get(req.params.id)
        if (!projects){
            next({
                status: 404, 
                message: `Projects with id:${req.params.id} not found`
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
function validateProjectName(req, res, next){
    // console.log('LOOK', req.body)
    const { name } = req.body;
    if (!name || !name.trim()){
        next({
            status: 400,
            message: "missing name field"
        })
    } else {
        req.name = name.trim()
        next()
    }
}


function validateProjectInfo(req, res, next){
    const { description } = req.body;
    if (!description || !description.trim()){
        next({
            status: 400,
            message: "missing description field"
        })
    } else {
        req.description = description.trim()
        next()
    }
}

module.exports = {
    validateProjectId,
    validateProjectName,
    validateProjectInfo
}