// Write your "projects" router here!
const express = require('express');
const router = express.Router();
const Project = require('./projects-model');
const {validateProjectId, validateProjectPayload, handleError} = require('./projects-middleware')
//`[GET] /api/projects`  Returns an array of projects as the body of the response. If there are no projects it responds with an empty array.
router.get('/', (req, res) => {
    Project.get().then(projects => {
            if (!projects) {
                res.status(200).json([]);
            } else {
                res.status(200).json(projects);
            }
        }).catch(error => {
            console.log(error);
            res.status(500).json({message: "The projects could not be received"});
        });
});

// `[GET] /api/projects/:id` Returns a project with the given `id` as the body of the response. If there is no project with the given `id` it responds with a status code 404.
router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project);
})

// `[POST] /api/projects` Returns the newly created project as the body of the response. If the request body is missing any of the required fields it responds with a status code 400.
router.post('/', validateProjectPayload, (req, res) => {
    const newProject = req.body
    if(!newProject.name || newProject.description){
        res.status(400).json({message: 'Project is missing a required field'});
    }else{
        Project.insert(req.body).then(project => {
            res.json(project);
        }).catch(error => {
            console.log(error);
            res.status(500).json({message: "The projects could not be received"});
        });
    }
});

//`[PUT] /api/projects/:id` Returns the updated project as the body of the response. If there is no project with the given `id` it responds with a status code 404. If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', validateProjectId, validateProjectPayload, async (req, res) => {
    const updatedProject = await Project.update(req.params.id, req.body);
    res.status(200).json(updatedProject);
})

//`[DELETE] /api/projects/:id` Returns no response body. If there is no project with the given `id` it responds with a status code 404.
router.delete('/:id', validateProjectId, (req, res) => {
    if(!req.body.project){
        res.status(404).json({message: `Project with id ${req.params.id} not found`});
    }else{
        Project.remove(req.params.id);
    }
})

// `[GET] /api/projects/:id/actions` Returns an array of actions (could be empty) belonging to a project with the given `id`. If there is no project with the given `id` it responds with a status code 404.
router.get('/:id/actions', validateProjectId, (req,res) => {
    if(!req.body.project){
        res.status(404).json({message: `Project with id ${req.params.id} not found`});
    }else{
        Project.getProjectActions(req.params.id);
    }
})

router.use(handleError);

module.exports = router