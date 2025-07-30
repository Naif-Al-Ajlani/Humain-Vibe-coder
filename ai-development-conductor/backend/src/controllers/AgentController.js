class AgentController {
  constructor() {
    this.agents = {
      architect: { status: 'idle', lastActive: null },
      frontend: { status: 'idle', lastActive: null },
      backend: { status: 'idle', lastActive: null },
      qa: { status: 'idle', lastActive: null }
    };
    this.logs = [];
  }

  async getAgentStatus(req, res) {
    try {
      res.json({ agents: this.agents });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get agent status' });
    }
  }

  async activateAgent(req, res) {
    try {
      const { agentType, task } = req.body;

      if (!this.agents[agentType]) {
        return res.status(400).json({ error: 'Invalid agent type' });
      }

      this.agents[agentType] = {
        status: 'active',
        lastActive: new Date().toISOString(),
        currentTask: task
      };

      this.logAgentActivity(agentType, 'activated', task);

      res.json({ success: true, agent: this.agents[agentType] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to activate agent' });
    }
  }

  async coordinateAgents(req, res) {
    try {
      const { agents, task } = req.body;

      const coordination = {
        id: Date.now().toString(),
        agents: agents,
        task: task,
        status: 'coordinating',
        timestamp: new Date().toISOString()
      };

      // Activate specified agents
      agents.forEach(agentType => {
        if (this.agents[agentType]) {
          this.agents[agentType].status = 'coordinating';
          this.agents[agentType].lastActive = coordination.timestamp;
        }
      });

      this.logAgentActivity('system', 'coordination_started', task);

      res.json({ success: true, coordination });
    } catch (error) {
      res.status(500).json({ error: 'Failed to coordinate agents' });
    }
  }

  async getAgentLogs(req, res) {
    try {
      const { limit = 50 } = req.query;
      const recentLogs = this.logs.slice(-parseInt(limit));
      res.json({ logs: recentLogs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get agent logs' });
    }
  }

  logAgentActivity(agentType, action, details) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      agent: agentType,
      action: action,
      details: details
    });
  }
}

module.exports = new AgentController();
