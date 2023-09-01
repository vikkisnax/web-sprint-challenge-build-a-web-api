// Write your "projects" router here!
const express = require('express');
const Projects = require('./projects-model');
const { validateProjectId } = require ('./projects-middleware');

const router = express.Router()

router.get('/', validateProjectId, (req, res, next) => {
    console.log(req.user)
})


module.exports = router;
