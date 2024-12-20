# Chat Application with Ollama Integration

## Overview
A chat application that connects with Ollama to provide automated responses to user questions. The system keeps track of conversations to provide more relevant responses based on the chat context.

## System Architecture

```mermaid
flowchart LR
    User[User] <--> Frontend[Web Interface]
    Frontend <--> Backend[Server]
    Backend <--> Database[(Database)]
    Backend <--> Ollama[Ollama AI]
    
    style User fill:#f9f,stroke:#333
    style Frontend fill:#bbf,stroke:#333
    style Backend fill:#bfb,stroke:#333
    style Database fill:#fbb,stroke:#333
    style Ollama fill:#feb,stroke:#333
```

## Detailed Data Flow

```mermaid
flowchart TD
    User((User)) <--> |Interacts with| UI[Web Interface]
    subgraph Frontend
        UI --> |Sends Message| ApiClient[API Client]
        ApiClient --> |Updates| UI
    end
    
    subgraph Backend
        ApiClient <--> |HTTP/WebSocket| Server[Web Server]
        Server --> |Stores Messages| DB[(Database)]
        DB --> |Retrieves History| Server
        Server --> |Sends Prompt| Ollama[Ollama]
        Ollama --> |Returns Response| Server
    end
    
    subgraph Data Storage
        DB --> Messages[Chat Messages]
        DB --> History[Chat History]
        DB --> Context[Context Data]
    end
```

## Key Features

### For Users
- **Quick Responses**: Get instant answers through Ollama integration
- **Conversation History**: Access your previous chats anytime
- **Simple Interface**: Easy-to-use chat interface that works on any device
- **Context Awareness**: System remembers previous messages for better responses

### For Business
- **Easy Setup**: Simple integration with Ollama
- **Message Storage**: All conversations safely stored in database
- **Usage Tracking**: Monitor how the system is being used
- **Low Maintenance**: Automated responses reduce manual handling

## Project Timeline

### Week 1: Setup (Days 1-2)
- Install and configure Ollama
- Set up basic system
- Create database

### Week 2: Development (Days 3-5)
- Build chat interface
- Connect to Ollama
- Implement message storage
- Set up conversation tracking

### Week 3: Testing (Days 6-7)
- Test all features
- Fix any issues
- Document usage instructions
- Prepare for deployment

## Getting Started

### Requirements
- Web browser (Chrome, Firefox, Safari, Edge)
- Ollama installed on server
- Database for storing messages
- Node.js for running the server

### Basic Setup
1. Install Ollama
2. Set up the database
3. Start the server
4. Open the web interface

## Project Structure
```
chatbot/
├── backend/     # Server files
│   ├── src/
│   ├── config/
│   └── tests/
└── frontend/    # Website files
    ├── src/
    ├── public/
    └── tests/
```


## Support & Contact
For questions or help:
- Project Lead: Hafiz Abdulkareem
- Email: hafiz300@outlook.com  
