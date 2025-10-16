const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

// Créer un projet → admin ou membre
router.post('/', authMiddleware, roleMiddleware(['admin', 'member']), projectController.createProject);

// Lister tous les projets pour l'utilisateur connecté
router.get('/', authMiddleware, projectController.getUserProjects);

// Ajouter un membre à un projet → admin seulement
router.post('/add-member', authMiddleware, roleMiddleware(['admin']), projectController.addMember);

module.exports = router;