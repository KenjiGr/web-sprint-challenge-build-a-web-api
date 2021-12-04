// add middlewares here related to projects
const Project = require('./projects-model');

async function validateProjectId (req,res,next){
    try{
        const project = await Project.get(req.params.id);
        if(project){
          req.user = project
        }else{
          next({status: 404, message: 'user not found'});
        }
      }catch (err){
        next(err)
      }
}

async function validateProjectPayload (req,res,next){
    try {
        if (!req.body.name || !req.body.description || !req.body.completed) {
            res.status(400).json({ message: 'fields are required' })
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
}

function handleError(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        prodMessage: 'something went wrong'
    })
}

module.exports = {validateProjectId, validateProjectPayload, handleError}