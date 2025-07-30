const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');

// Project management endpoints
router.post('/create', ProjectController.createProject);
router.get('/:id', ProjectController.getProject);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/', ProjectController.listProjects);

module.exports = router;
