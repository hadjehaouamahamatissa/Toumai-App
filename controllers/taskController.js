const Task = require('../models/Task');
const Project = require('../models/Project');

// Créer une tâche (admin ou membre d’un projet)
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedTo } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    // Vérifier que l'utilisateur est membre du projet
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Accès interdit: non membre du projet' });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      project: projectId,
      assignedTo
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les tâches d’un projet
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    // Vérifier que l'utilisateur est membre du projet
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Accès interdit: non membre du projet' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'username email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour le statut d’une tâche (in-progress, completed)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    // Vérifier que l'utilisateur est membre du projet de la tâche
    const project = await Project.findById(task.project);
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Accès interdit: non membre du projet' });
    }

    task.status = status;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
