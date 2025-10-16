const Project = require('../models/Project');
const Task = require('../models/Task');

// Créer un projet (admin ou membre)
exports.createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = new Project({
      title,
      description,
      createdBy: req.user.id,
      members
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les projets auxquels l'utilisateur appartient
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate('members', 'username email');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un membre à un projet (admin seulement)
exports.addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
