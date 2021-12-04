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

function validateProjectPayload (req,res,next){
    const { name, description, completed } = req.body;
    if (!name || !description || !completed) {
        res.status(400).json({ message: 'missing required name field' });
    } else {
    next();
  }
}

module.exports = {validateProjectId, validateProjectPayload}