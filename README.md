# Clarity Flow

**Secure AI-Powered Business Management Platform**  
Clarity Flow is a comprehensive business management platform that leverages AI agents to help users organize and manage their business operations through natural language interactions. Built with Auth0 for AI Agents to ensure secure access and fine-grained authorization.

![Deploy](https://deploy-badge.vercel.app/vercel/clarity-flow)

## Features

- **Dashboard**: Overview of business metrics and recent activities
- **Appointments Management**: Schedule and manage meetings with AI assistance
- **Employee Management**: Handle team members and roles
- **Task Tracking**: Assign and monitor work items
- **Sales Monitoring**: Track performance and deals
- **AI Chat Interface**: Conversational AI that can perform CRUD operations on business data through natural language commands
- **Secure Authentication**: Auth0 integration for user authentication and AI agent authorization
- **Role-Based Permissions**: Hierarchical access control with admin, manager, and employee roles
- **Department-Based Access**: Compartmentalized data access by departments

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- ShadCN UI
- TailwindCSS

### Backend

- Fastify
- Google Gemini AI
- Auth0 for AI Agents

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Auth0 account and application setup

### Installation

```bash
# Clone the frontend repository
git clone https://github.com/wesleybertipaglia/clarity-flow-app.git
cd clarity-flow-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

The backend API is available at: [https://github.com/wesleybertipaglia/clarity-flow-api](https://github.com/wesleybertipaglia/clarity-flow-api)

## Demo

**Live Demo**: [https://clarity-flow.vercel.app](https://clarity-flow.vercel.app)

To test the application:

1. Visit the live demo
2. Authenticate with Auth0
3. Use the AI chat to interact with business data
4. Try commands like "Create a new task for marketing campaign" or "List all appointments for this week"

## Security

Clarity Flow uses Auth0 for AI Agents to secure AI agent access to business resources:

- User authentication and token-based access
- Token Vault for secure API access
- Fine-grained permissions based on roles and departments
- Context-aware AI responses limited by user permissions

## Contributing

Contributions are welcome! If you'd like to help improve Clarity Flow, feel free to fork the repository, open a pull request, or submit issues.

## License

This project is licensed under the [MIT License](LICENSE).
