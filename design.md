# CodeSherpa - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Web Browser (React)  │  WhatsApp  │  GitHub Webhooks       │
└───────────┬─────────────────┬───────────────┬───────────────┘
            │                 │               │
            │ WebSocket/HTTP  │ HTTP          │ HTTP
            │                 │               │
┌───────────▼─────────────────▼───────────────▼───────────────┐
│                     API Gateway Layer                        │
│                    (FastAPI Application)                     │
├─────────────────────────────────────────────────────────────┤
│  /ws (WebSocket)  │  /api/chat  │  /api/github  │  /api/wa  │
└───────────┬─────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────┐
│                   Agent Orchestration Layer                  │
├─────────────────────────────────────────────────────────────┤
│                    Orchestrator Agent                        │
│              (Intent Classification & Routing)               │
└───────┬───────────────────────────┬─────────────────────────┘
        │                           │
┌───────▼──────────┐       ┌────────▼─────────────┐
│  Review Monk     │       │  Codebase Sherpa     │
│  Agent           │       │  Agent               │
│  (Code Review)   │       │  (Learning/Explain)  │
└───────┬──────────┘       └────────┬─────────────┘
        │                           │
        └───────────┬───────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                    Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Bedrock Service  │  GitHub Service  │  Redis Client        │
└───────┬───────────────────┬───────────────────┬─────────────┘
        │                   │                   │
┌───────▼──────┐   ┌────────▼────────┐   ┌──────▼──────┐
│ AWS Bedrock  │   │  GitHub API     │   │   Redis     │
│ (Claude 3.5) │   │                 │   │   Cache     │
└──────────────┘   └─────────────────┘   └─────────────┘
```

### 1.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ChatInterface│  │  Dashboard   │  │  UI Components│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket/REST
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    main.py                           │   │
│  │  - FastAPI App                                       │   │
│  │  - CORS Middleware                                   │   │
│  │  - WebSocket Manager                                 │   │
│  │  - Route Handlers                                    │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │              Agents Module                           │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  BaseAgent (Abstract)                        │   │   │
│  │  │  - save_context()                            │   │   │
│  │  │  - get_context()                             │   │   │
│  │  │  - call_claude()                             │   │   │
│  │  │  - process() [abstract]                      │   │   │
│  │  └──────────────────┬───────────────────────────┘   │   │
│  │                     │                                │   │
│  │       ┌─────────────┼─────────────┐                 │   │
│  │       │             │             │                 │   │
│  │  ┌────▼────┐  ┌─────▼─────┐  ┌───▼──────┐         │   │
│  │  │Orchestr-│  │Review Monk│  │Codebase  │         │   │
│  │  │ator     │  │Agent      │  │Sherpa    │         │   │
│  │  └─────────┘  └───────────┘  └──────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │              Services Module                         │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │Bedrock       │  │GitHub        │                 │   │
│  │  │Service       │  │Service       │                 │   │
│  │  └──────────────┘  └──────────────┘                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │               Core Module                            │   │
│  │  - config.py (Settings)                              │   │
│  │  - redis_client.py                                   │   │
│  │  - demo_data.py                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 2. Data Flow Design

### 2.1 Chat Message Flow

```
User Input → Frontend → WebSocket → Backend → Orchestrator
                                                    │
                                    ┌───────────────┴───────────────┐
                                    │                               │
                              Intent = Review                Intent = Explain
                                    │                               │
                                    ▼                               ▼
                            Review Monk Agent              Codebase Sherpa Agent
                                    │                               │
                                    ├───────────────┬───────────────┤
                                    │               │               │
                                    ▼               ▼               ▼
                            Bedrock Service   GitHub Service   Redis Cache
                                    │               │               │
                                    └───────────────┴───────────────┘
                                                    │
                                            Response JSON
                                                    │
                                                    ▼
                            Backend → WebSocket → Frontend → User
```

### 2.2 GitHub Webhook Flow

```
GitHub PR Event → Webhook → /api/github/webhook → Verify Signature
                                                          │
                                                          ▼
                                                  Extract PR Data
                                                          │
                                                          ▼
                                              GitHub Service (fetch diff)
                                                          │
                                                          ▼
                                                  Review Monk Agent
                                                          │
                                                          ▼
                                                  Bedrock Analysis
                                                          │
                                                          ▼
                                          GitHub Service (post comment)
                                                          │
                                                          ▼
                                                  Return Success
```

## 3. Agent Design

### 3.1 Base Agent Architecture

```python
BaseAgent (Abstract Class)
│
├── Attributes:
│   ├── agent_name: str
│   ├── bedrock: BedrockService
│   └── redis: RedisClient
│
├── Methods:
│   ├── save_context(session_id, key, value, expire)
│   ├── get_context(session_id, key)
│   ├── call_claude(prompt, system_prompt, temperature)
│   └── process(input_data, session_id) [abstract]
│
└── Inherited by:
    ├── OrchestratorAgent
    ├── ReviewMonkAgent
    └── CodebaseSherpaAgent
```

### 3.2 Orchestrator Agent Design

**Purpose**: Route user requests to specialized agents based on intent classification

**System Prompt**:
- Classify user intent into categories: review_monk, codebase_sherpa, general_chat
- Output structured JSON with target_agent, confidence, and reasoning

**Process Flow**:
1. Receive user message
2. Check for demo keywords
3. Call Claude for intent classification
4. Parse JSON response
5. Route to appropriate agent
6. Return agent response

**Input Schema**:
```json
{
  "message": "string",
  "code_context": "string (optional)",
  "session_id": "string"
}
```

**Output Schema**:
```json
{
  "target_agent": "review_monk | codebase_sherpa | general_chat",
  "confidence": 0.0-1.0,
  "reasoning": "string"
}
```

### 3.3 Review Monk Agent Design

**Purpose**: Analyze code diffs for bugs, security issues, and best practices

**System Prompt**:
- Professional, constructive tone
- Focus on OWASP Top 10 security issues
- Check timezone handling (IST vs UTC)
- Provide AWS optimization suggestions
- Output structured JSON review

**Process Flow**:
1. Receive diff and PR metadata
2. Truncate diff if > 20,000 characters
3. Call Claude with review prompt
4. Parse JSON response
5. Save review to Redis context
6. Return structured review

**Input Schema**:
```json
{
  "diff": "string",
  "pr_title": "string",
  "language": "string (optional)"
}
```

**Output Schema**:
```json
{
  "summary": "string",
  "findings": [
    {
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "file": "string",
      "line": number,
      "issue": "string",
      "suggestion": "string",
      "code_fix": "string"
    }
  ],
  "quality_score": 1-10,
  "security_risk": "None | Low | High"
}
```

### 3.4 Codebase Sherpa Agent Design

**Purpose**: Explain code and create learning paths for developers

**System Prompt**:
- Patient, teacher-like tone
- Use culturally relevant analogies
- Support English, Hindi, Hinglish
- Break down complex concepts
- Output structured JSON explanation

**Process Flow**:
1. Receive code snippet and action type
2. Determine target language
3. Build appropriate prompt (explain vs learning_path)
4. Call Claude with higher temperature (0.7)
5. Parse JSON response
6. Return structured explanation

**Input Schema**:
```json
{
  "action": "explain | learning_path",
  "code_snippet": "string",
  "file_path": "string (optional)",
  "target_language": "English | Hindi | Hinglish"
}
```

**Output Schema**:
```json
{
  "explanation": "string (markdown)",
  "learning_steps": ["string"],
  "key_concepts": [
    {
      "term": "string",
      "definition": "string"
    }
  ],
  "analogy": "string"
}
```

## 4. Service Layer Design

### 4.1 Bedrock Service

**Responsibilities**:
- Manage AWS Bedrock client initialization
- Handle Claude 3.5 Sonnet invocations
- Implement mock mode fallback
- Manage token limits and temperature

**Key Methods**:
```python
class BedrockService:
    def __init__(self)
    async def invoke_claude(prompt, system_prompt, max_tokens, temperature)
    def _get_mock_response(prompt) -> str
```

**Mock Mode Logic**:
- Activated when AWS credentials are missing or invalid
- Provides keyword-based responses for demo purposes
- Returns structured JSON matching expected formats

**Error Handling**:
- Catch ClientError, BotoCoreError
- Log errors and fall back to mock mode
- Ensure graceful degradation

### 4.2 GitHub Service

**Responsibilities**:
- Fetch PR diffs via GitHub API
- Post review comments on PRs
- Handle authentication with tokens
- Manage rate limiting

**Key Methods**:
```python
class GitHubService:
    def __init__(self)
    async def get_pr_diff(repo_full_name, pr_number) -> str
    async def post_comment(repo_full_name, pr_number, body) -> bool
```

**API Configuration**:
- Base URL: https://api.github.com
- API Version: 2022-11-28
- Accept header: application/vnd.github.v3.diff (for diffs)
- Accept header: application/vnd.github.v3+json (for comments)

### 4.3 Redis Client

**Responsibilities**:
- Manage Redis connections
- Store session context with TTL
- Provide async get/set operations

**Key Operations**:
- Session storage: `agent:{agent_name}:{session_id}:{key}`
- Default TTL: 3600 seconds (1 hour)
- JSON serialization for complex objects

## 5. API Design

### 5.1 REST Endpoints

#### GET /health
**Purpose**: Health check endpoint

**Response**:
```json
{
  "status": "ok",
  "service": "CodeSherpa Backend"
}
```

#### POST /api/chat
**Purpose**: HTTP-based chat endpoint

**Request**:
```json
{
  "message": "string",
  "session_id": "string",
  "code_context": "string (optional)"
}
```

**Response**:
```json
{
  "reply": "string",
  // or structured agent response
}
```

#### POST /api/github/webhook
**Purpose**: Receive GitHub webhook events

**Headers**:
- X-Hub-Signature-256: HMAC signature for verification

**Request**: GitHub webhook payload

**Response**:
```json
{
  "status": "processed"
}
```

#### POST /api/whatsapp/webhook
**Purpose**: Receive WhatsApp messages (future)

**Request**: WhatsApp webhook payload

**Response**:
```json
{
  "status": "received"
}
```

### 5.2 WebSocket Protocol

#### Connection: ws://localhost:8000/ws

**Client → Server Message**:
```json
{
  "message": "string",
  "session_id": "string",
  "code_context": "string (optional)"
}
```

**Server → Client Messages**:

Status Update:
```json
{
  "type": "status",
  "content": "thinking"
}
```

Response:
```json
{
  "type": "response",
  "content": {
    // Agent response object
  }
}
```

Error:
```json
{
  "error": "string"
}
```

## 6. Database Design

### 6.1 Redis Schema

**Session Context**:
```
Key: agent:{agent_name}:{session_id}:{context_key}
Value: JSON string
TTL: 3600 seconds
```

**Example Keys**:
- `agent:review_monk:demo-session-1:last_review`
- `agent:codebase_sherpa:user123:learning_history`
- `agent:orchestrator:session456:conversation_state`

### 6.2 DynamoDB Schema (Future)

**Table: codesherpa_memory**

**Partition Key**: user_id (String)
**Sort Key**: timestamp (Number)

**Attributes**:
- session_id: String
- agent_name: String
- interaction_type: String (review | explain | chat)
- input_data: Map
- output_data: Map
- metadata: Map (language, quality_score, etc.)

## 7. Frontend Design

### 7.1 Component Hierarchy

```
App
├── Dashboard
│   └── StatCard (x4)
└── ChatInterface
    ├── Header
    │   ├── ConnectionStatus
    │   └── LanguageToggle
    ├── MessageList
    │   └── Message
    │       ├── ReactMarkdown
    │       └── SyntaxHighlighter
    └── InputArea
        ├── MicButton
        ├── TextInput
        └── SendButton
```

### 7.2 State Management

**ChatInterface State**:
```javascript
{
  messages: [
    {
      id: number,
      sender: 'user' | 'agent',
      text: string,
      reviewData: object | null,
      timestamp: string
    }
  ],
  input: string,
  isTyping: boolean,
  isConnected: boolean
}
```

**WebSocket Connection**:
- Established on component mount
- Reconnection logic on disconnect
- Message queue for offline messages

### 7.3 UI/UX Design Principles

**Color Scheme**:
- Background: gray-950 (dark mode)
- Primary: blue-600 (actions)
- Secondary: purple-500 (accents)
- Success: green-400
- Warning: yellow-400
- Error: red-500

**Typography**:
- Headings: Extrabold, gradient text
- Body: Sans-serif, gray-200
- Code: Monospace, syntax highlighted

**Responsive Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 8. Security Design

### 8.1 Authentication & Authorization

**GitHub Integration**:
- OAuth token stored in environment variables
- Token scoped to minimum required permissions
- Webhook signature verification using HMAC-SHA256

**AWS Bedrock**:
- IAM credentials with least-privilege access
- Credentials never exposed to frontend
- Region-specific endpoint usage

### 8.2 Data Protection

**Sensitive Data Handling**:
- No code stored permanently without consent
- Session data expires after 1 hour
- Logs sanitized to remove PII

**CORS Configuration**:
- Production: Whitelist specific frontend domain
- Development: Allow localhost only
- Credentials: true for authenticated requests

### 8.3 Input Validation

**Backend Validation**:
- Pydantic models for request validation
- Maximum message length: 10,000 characters
- Diff truncation at 20,000 characters
- JSON schema validation for agent responses

**Frontend Validation**:
- Non-empty message check
- Connection status check before send
- WebSocket message size limit

## 9. Deployment Design

### 9.1 Docker Architecture

**Services**:
1. Backend (Python FastAPI)
   - Port: 8000
   - Volume: ./backend:/app
   - Depends on: redis

2. Frontend (React + NGINX)
   - Port: 3000 (dev) / 80 (prod)
   - Depends on: backend

3. Redis (Alpine)
   - Port: 6379
   - Volume: redis_data

### 9.2 Environment Configuration

**Backend .env**:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
GITHUB_TOKEN=<token>
GITHUB_WEBHOOK_SECRET=<secret>
REDIS_URL=redis://redis:6379/0
DYNAMODB_TABLE_NAME=codesherpa_memory
```

### 9.3 Production Deployment (AWS)

**Recommended Architecture**:
```
Route 53 (DNS)
    │
    ▼
CloudFront (CDN)
    │
    ├─► S3 (Frontend Static Files)
    │
    └─► ALB (Application Load Balancer)
            │
            ▼
        ECS Fargate (Backend Containers)
            │
            ├─► Bedrock (AI Service)
            ├─► ElastiCache Redis (Session Store)
            └─► DynamoDB (Long-term Storage)
```

**Scaling Strategy**:
- Auto-scaling based on CPU/Memory
- Target: 70% CPU utilization
- Min instances: 2
- Max instances: 10

## 10. Error Handling Design

### 10.1 Error Categories

**Client Errors (4xx)**:
- 400: Invalid request format
- 401: Missing authentication
- 404: Resource not found
- 429: Rate limit exceeded

**Server Errors (5xx)**:
- 500: Internal server error
- 502: Bad gateway (external service failure)
- 503: Service unavailable

### 10.2 Error Response Format

```json
{
  "error": "string",
  "detail": "string (optional)",
  "code": "ERROR_CODE",
  "timestamp": "ISO 8601 string"
}
```

### 10.3 Fallback Strategies

**AWS Bedrock Failure**:
- Switch to mock mode
- Log error for monitoring
- Notify user of demo mode

**GitHub API Failure**:
- Return cached data if available
- Provide manual diff input option
- Retry with exponential backoff

**Redis Failure**:
- Use in-memory session storage
- Warn about session persistence
- Continue with degraded functionality

## 11. Monitoring & Logging Design

### 11.1 Logging Strategy

**Log Levels**:
- DEBUG: Detailed diagnostic information
- INFO: General informational messages
- WARNING: Warning messages (fallback modes)
- ERROR: Error messages with stack traces

**Log Format**:
```
[TIMESTAMP] [LEVEL] [AGENT/SERVICE] Message
```

**Key Events to Log**:
- Agent invocations
- External API calls
- Error conditions
- Performance metrics
- User interactions (anonymized)

### 11.2 Metrics to Track

**Performance Metrics**:
- Response time (p50, p95, p99)
- Token usage per request
- API call latency
- WebSocket connection duration

**Business Metrics**:
- PRs reviewed per day
- Learning paths generated
- User sessions
- Cost per interaction (AWS Bedrock)

## 12. Testing Strategy

### 12.1 Unit Testing

**Backend**:
- Test each agent's process() method
- Mock Bedrock and GitHub services
- Test Redis context operations
- Validate JSON parsing

**Frontend**:
- Test component rendering
- Test WebSocket message handling
- Test markdown rendering
- Test user interactions

### 12.2 Integration Testing

- End-to-end chat flow
- GitHub webhook processing
- Agent routing logic
- Error handling scenarios

### 12.3 Demo Testing

**Demo Scenarios**:
1. "Namaste demo" → Hindi explanation
2. "Review demo" → Sample PR analysis
3. Connection status display
4. Typing indicators
5. Markdown and code rendering

---

**Document Version**: 1.0  
**Last Updated**: February 14, 2026  
**Status**: Draft  
**Owner**: CodeSherpa Team
