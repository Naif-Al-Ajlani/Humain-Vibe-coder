# 🔌 API Reference

## Authentication

All API endpoints require authentication using JWT tokens:

```http
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
Production: https://api.ai-conductor.com
Development: http://localhost:3001/api
```

## Endpoints

### Projects

#### Create Project
```http
POST /api/projects/create
```

**Request Body:**
```json
{
  "name": "My AI Project",
  "description": "Build a todo app with AI categorization",
  "requirements": "CRUD operations, AI categorization, real-time updates"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "1643723400000",
    "name": "My AI Project",
    "description": "Build a todo app with AI categorization",
    "status": "processing",
    "createdAt": "2025-01-30T10:30:00Z",
    "coordination": {
      "id": "coord_1643723400000",
      "workflow": "project_initialization",
      "status": "running"
    }
  }
}
```

#### Get Project
```http
GET /api/projects/:id
```

**Response:**
```json
{
  "project": {
    "id": "1643723400000",
    "name": "My AI Project",
    "status": "completed",
    "agents": ["architect", "frontend", "backend", "qa"],
    "timeline": [
      {
        "id": "created",
        "type": "created",
        "title": "Project Created",
        "timestamp": "2025-01-30T10:30:00Z"
      }
    ],
    "generatedCode": {
      "frontend": "// React components...",
      "backend": "// Express API..."
    }
  }
}
```

### Agents

#### Get Agent Status
```http
GET /api/agents/status
```

**Response:**
```json
{
  "agents": [
    {
      "id": "architect",
      "name": "Architect Agent",
      "role": "System Design and Planning",
      "status": "idle",
      "lastActive": "2025-01-30T10:25:00Z",
      "capabilities": [
        "system_design",
        "technology_selection",
        "architecture_planning"
      ]
    }
  ]
}
```

#### Start Workflow
```http
POST /api/agents/workflow/start
```

**Request Body:**
```json
{
  "projectId": "1643723400000",
  "projectDescription": "Build a todo app with AI categorization"
}
```

### Examples

#### List Examples
```http
GET /api/examples
```

**Response:**
```json
{
  "examples": [
    {
      "id": "todo-app-demo",
      "name": "AI Todo App",
      "type": "todo-app",
      "status": "completed",
      "createdAt": "2025-01-30T09:00:00Z",
      "generationTime": "2m 34s",
      "agentsUsed": 4
    }
  ]
}
```

#### Generate Example
```http
POST /api/examples/generate
```

**Request Body:**
```json
{
  "exampleType": "todo-app"
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3001');
```

### Events

#### Workflow Updates
```javascript
socket.on('workflow_update', (data) => {
  console.log('Workflow update:', data);
  // {
  //   projectId: "1643723400000",
  //   currentStep: 2,
  //   steps: [...],
  //   isActive: true
  // }
});
```

#### Agent Status Updates
```javascript
socket.on('agent_status_update', (data) => {
  console.log('Agent status:', data);
  // {
  //   agentId: "architect",
  //   status: {
  //     status: "active",
  //     currentTask: {...}
  //   }
  // }
});
```

## Error Handling

### Error Response Format
```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limits

- **Standard**: 100 requests per minute
- **AI Generation**: 10 requests per minute
- **WebSocket**: 1000 messages per minute

## SDKs

### JavaScript SDK
```bash
npm install @ai-conductor/sdk
```

```javascript
import { AIConductor } from '@ai-conductor/sdk';

const conductor = new AIConductor({
  apiKey: 'your-api-key',
  baseURL: 'https://api.ai-conductor.com'
});

// Create project
const project = await conductor.projects.create({
  name: 'My Project',
  description: 'Build a todo app'
});

// Monitor progress
conductor.on('workflow_update', (update) => {
  console.log('Progress:', update);
});
```
