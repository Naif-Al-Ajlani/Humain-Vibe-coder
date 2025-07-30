class ProjectController {
  constructor() {
    this.projects = new Map(); // Will be replaced with database in later phases
  }

  async createProject(req, res) {
    try {
      const { name, description, requirements } = req.body;

      const project = {
        id: Date.now().toString(),
        name,
        description,
        requirements,
        status: 'initialized',
        createdAt: new Date().toISOString(),
        agents: [],
        timeline: []
      };

      this.projects.set(project.id, project);

      res.status(201).json({ success: true, project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  async getProject(req, res) {
    try {
      const { id } = req.params;
      const project = this.projects.get(id);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({ project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get project' });
    }
  }

  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const project = this.projects.get(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const updatedProject = { ...project, ...updates, updatedAt: new Date().toISOString() };
      this.projects.set(id, updatedProject);

      res.json({ success: true, project: updatedProject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params;

      if (!this.projects.has(id)) {
        return res.status(404).json({ error: 'Project not found' });
      }

      this.projects.delete(id);
      res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  async listProjects(req, res) {
    try {
      const projects = Array.from(this.projects.values());
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list projects' });
    }
  }
}

module.exports = new ProjectController();
