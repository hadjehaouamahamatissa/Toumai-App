const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

// Créer une tâche → admin ou membre du projet
router.post('/', authMiddleware, roleMiddleware(['admin', 'member']), taskController.createTask);

// Lister les tâches d’un projet
router.get('/:projectId', authMiddleware, taskController.getProjectTasks);

// Mettre à jour le statut d’une tâche
router.put('/status', authMiddleware, taskController.updateTaskStatus);

module.exports = router;
