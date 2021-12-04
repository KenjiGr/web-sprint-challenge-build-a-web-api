const express = require('express')
const {validateActionId,} = require('./actions-middlware')
const Actions = require('./actions-model')
const router = express.Router()

router.use(express.json())

// Write your "actions" router here!
// `[GET] /api/actions` Returns an array of actions (or an empty array) as the body of the response.
router.get('/', async (req, res, next) => {
    try {
        const actions = await Actions.get(req.params.id);
        res.status(200).json(actions);
    } catch (err) {
        next(err);
    }   
})

//`[GET] /api/actions/:id` Returns an action with the given `id` as the body of the response. If there is no action with the given `id` it responds with a status code 404.
router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action);
})

//`[POST] /api/actions` Returns the newly created action as the body of the response. If the request body is missing any of the required fields it responds with a status code 400. When adding an action make sure the `project_id` provided belongs to an existing `project`.
router.post('/', (req, res) => {
    const newAction = req.body;
    if (newAction.project_id && newAction.description && newAction.notes) {
        Actions.insert(newAction).then(action => {
                res.status(201).json(action);
            }).catch(error => {
                console.log(error);
                res.status(500).json({message: "The action could not be recieved"});
            })
        } else{
            res.status(400).json({
                message: "Project id, description, and notes required"
            });
        }
})
    
// `[PUT] /api/actions/:id` Returns the updated action as the body of the response. If there is no action with the given `id` it responds with a status code 404. If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', async (req, res) => {
    try{
        const updatedAction = await Actions.update(req.params.id, req.body);
        res.status(200).json(updatedAction);
    } catch{
        res.status(400).json({
            message: "Project id, description, and notes required"
        });
    }
});

// `[DELETE] /api/actions/:id` Returns no response body. If there is no action with the given `id` it responds with a status code 404.
router.delete('/:id', (req, res, next) => {
    Actions.remove(req.params.id).then(() => {
            res.status(200).json({message: "The action was deleted"})}).catch(next);
})


module.exports = router;