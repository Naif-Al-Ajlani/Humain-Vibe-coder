const AgentController = require('./AgentController');

class ProjectController {
  constructor() {
    this.projects = new Map();
  }

  async createProject(req, res) {
    try {
      const { name, description, requirements } = req.body;

      const project = {
        id: Date.now().toString(),
        name,
        description,
        requirements,
        status: 'initializing',
        createdAt: new Date().toISOString(),
        agents: [],
        timeline: [{
          id: 'created',
          type: 'created',
          title: 'Project Created',
          description: 'Project initialized and ready for AI analysis',
          timestamp: new Date().toISOString()
        }],
        coordination: null
      };

      this.projects.set(project.id, project);

      // Start agent workflow
      const workflowResult = await AgentController.startProjectWorkflow({
        body: {
          projectId: project.id,
          projectDescription: description
        },
        app: { get: () => req.app.get('io') }
      }, { json: (data) => data });

      project.coordination = workflowResult.coordination;
      project.status = 'processing';

      project.timeline.push({
        id: 'workflow_started',
        type: 'workflow_started',
        title: 'AI Workflow Started',
        description: 'Multi-agent system activated for project analysis',
        timestamp: new Date().toISOString(),
        agent: 'system'
      });

      res.status(201).json({ success: true, project });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  async updateProjectWithAgentResult(projectId, agentResult) {
    const project = this.projects.get(projectId);
    if (!project) return;

    project.timeline.push({
      id: `agent_${agentResult.agent}_${Date.now()}`,
      type: 'agent_completed',
      title: `${agentResult.agent} Agent Completed`,
      description: `${agentResult.agent} agent finished: ${agentResult.task.action}`,
      timestamp: agentResult.timestamp,
      agent: agentResult.agent,
      details: agentResult.result
    });

    if (!project.agents.includes(agentResult.agent)) {
      project.agents.push(agentResult.agent);
    }
  }

  // ... (rest of methods remain the same)
}

module.exports = new ProjectController();
