import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/todos', {
        text: newTodo,
        aiCategorize: true
      });

      setTodos(prev => [...prev, response.data.todo]);
      setNewTodo('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      });

      setTodos(prev => prev.map(t =>
        t.id === id ? response.data.todo : t
      ));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'work': '💼',
      'personal': '👤',
      'health': '🏥',
      'shopping': '🛒',
      'learning': '📚',
      'other': '📝'
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'work': '#3b82f6',
      'personal': '#10b981',
      'health': '#ef4444',
      'shopping': '#f59e0b',
      'learning': '#8b5cf6',
      'other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="todo-app">
      <div className="todo-header">
        <h1>🤖 AI-Powered Todo App</h1>
        <p>Tasks are automatically categorized using AI</p>
      </div>

      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a task (AI will categorize it automatically)..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          disabled={isLoading}
        />
        <button
          onClick={addTodo}
          disabled={!newTodo.trim() || isLoading}
          className="add-button"
        >
          {isLoading ? '🔄' : '➕'} Add Task
        </button>
      </div>

      <div className="todo-stats">
        <div className="stat">
          <span className="stat-value">{todos.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat">
          <span className="stat-value">{todos.filter(t => t.completed).length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat">
          <span className="stat-value">{todos.filter(t => !t.completed).length}</span>
          <span className="stat-label">Remaining</span>
        </div>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <button
              className="todo-toggle"
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed ? '✅' : '⭕'}
            </button>

            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <div className="todo-meta">
                <span
                  className="todo-category"
                  style={{ backgroundColor: getCategoryColor(todo.category) }}
                >
                  {getCategoryIcon(todo.category)} {todo.category}
                </span>
                <span className="todo-confidence">
                  🎯 {Math.round(todo.aiConfidence * 100)}%
                </span>
                <span className="todo-time">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              className="todo-delete"
              onClick={() => deleteTodo(todo.id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No tasks yet. Add one above to see AI categorization in action!</p>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
