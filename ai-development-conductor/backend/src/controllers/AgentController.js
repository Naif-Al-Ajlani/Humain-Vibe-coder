const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const AIController = require('./AIController');

class AgentController {
  constructor() {
    this.agents = new Map();
    this.workflows = new Map();
    this.activeCoordinations = new Map();
    this.loadAgentDefinitions();
    this.loadWorkflows();
  }

  async loadAgentDefinitions() {
    try {
      const agentDirs = ['architect-agent', 'frontend-agent', 'backend-agent', 'qa-agent'];

      for (const dir of agentDirs) {
        const defPath = path.join(__dirname, '../../../ai-agents', dir, 'agent-definition.yaml');
        const yamlContent = await fs.readFile(defPath, 'utf8');
        const agentDef = yaml.load(yamlContent);
        this.agents.set(agentDef.id, {
          ...agentDef,
          status: 'idle',
          lastActive: null,
          currentTask: null
        });
      }

      console.log('✅ Loaded agent definitions:', Array.from(this.agents.keys()));
    } catch (error) {
      console.error('❌ Failed to load agent definitions:', error);
    }
  }

  async loadWorkflows() {
    try {
      const workflowFiles = [
        'development-pipeline/project-initialization.json',
        'development-pipeline/code-generation-pipeline.json',
        'ai-coordination/multi-agent-orchestration.json'
      ];

      for (const file of workflowFiles) {
        const workflowPath = path.join(__dirname, '../../../workflows', file);
        const workflowContent = await fs.readFile(workflowPath, 'utf8');
        const workflow = JSON.parse(workflowContent);
        this.workflows.set(workflow.id, workflow);
      }

      console.log('✅ Loaded workflows:', Array.from(this.workflows.keys()));
    } catch (error) {
      console.error('❌ Failed to load workflows:', error);
    }
  }

  async startProjectWorkflow(req, res) {
    try {
      const { projectId, projectDescription } = req.body;

      const coordination = {
        id: `coord_${Date.now()}`,
        projectId,
        workflow: 'project_initialization',
        status: 'running',
        startTime: new Date().toISOString(),
        steps: [],
        currentStep: 0
      };

      this.activeCoordinations.set(coordination.id, coordination);

      // Start with architect agent
      const architectAgent = this.agents.get('architect');
      const analysisResult = await this.activateAgent('architect', {
        action: 'analyze_requirements',
        projectDescription,
        projectId
      });

      coordination.steps.push({
        agent: 'architect',
        action: 'analyze_requirements',
        result: analysisResult,
        timestamp: new Date().toISOString()
      });

      // Emit real-time update
      req.app.get('io').emit('workflow_update', {
        projectId,
        coordinationId: coordination.id,
        currentStep: coordination.currentStep,
        steps: coordination.steps,
        isActive: true
      });

      res.json({ success: true, coordination });
    } catch (error) {
      console.error('Workflow error:', error);
      res.status(500).json({ error: 'Failed to start workflow' });
    }
  }

  async activateAgent(agentId, task) {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }

      // Update agent status
      agent.status = 'active';
      agent.lastActive = new Date().toISOString();
      agent.currentTask = task;

      // Process task with AI
      const prompt = this.buildAgentPrompt(agent, task);
      const aiResponse = await AIController.processPrompt({
        body: {
          prompt,
          model: agent.models.primary
        }
      }, { json: (data) => data });

      // Update agent status
      agent.status = 'idle';
      agent.currentTask = null;

      this.logAgentActivity(agentId, 'task_completed', task);

      return {
        agent: agentId,
        task: task,
        result: aiResponse.response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Agent ${agentId} error:`, error);
      throw error;
    }
  }

  buildAgentPrompt(agent, task) {
    let prompt = agent.prompts.system_prompt + '\n\n';
    prompt += `Task: ${task.action}\n`;
    prompt += `Context: ${JSON.stringify(task, null, 2)}\n\n`;
    prompt += 'Please provide a structured response that can be used by other agents in the development pipeline.';
    return prompt;
  }

  async coordinateAgents(req, res) {
    try {
      const { projectId, agents, task } = req.body;

      const results = await Promise.all(
        agents.map(agentId => this.activateAgent(agentId, task))
      );

      res.json({
        success: true,
        coordination: {
          projectId,
          agents,
          task,
          results,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Agent coordination error:', error);
      res.status(500).json({ error: 'Failed to coordinate agents' });
    }
  }

  async getAgentStatus(req, res) {
    try {
      const agentStatuses = Array.from(this.agents.entries()).map(([id, agent]) => ({
        id,
        name: agent.name,
        role: agent.role,
        status: agent.status,
        lastActive: agent.lastActive,
        currentTask: agent.currentTask,
        capabilities: agent.capabilities
      }));

      res.json({ agents: agentStatuses });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get agent status' });
    }
  }

  logAgentActivity(agentId, action, details) {
    console.log(`🤖 Agent ${agentId}: ${action}`, details);
  }
}

module.exports = new AgentController();
