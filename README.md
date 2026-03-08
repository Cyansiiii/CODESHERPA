# 🏔️ CodeSherpa — AI-Powered Developer Productivity Platform

> **Multi-Agent AI pair programmer optimized for Indian developers**
> Built with ❤️ for **AI FOR BHARAT**

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20DynamoDB%20%7C%20Polly-orange?logo=amazonaws)](https://aws.amazon.com)

---

## ✨ What is CodeSherpa?

CodeSherpa is an intelligent multi-agent platform that helps developers **review code, explain concepts, and learn faster** — with native support for Hindi, Bengali, Tamil, and Hinglish. Think of it as your AI pair programmer who speaks your language.

### 🎯 Key Capabilities

| Feature | Description |
|---|---|
| 🔍 **Review Monk** | AI code reviewer — catches bugs, security issues, and suggests fixes |
| 📚 **Codebase Sherpa** | Explains code with analogies, learning paths, and key concepts |
| 🌐 **Multilingual** | Responses in English, Hindi, Bengali, Tamil, and Hinglish |
| 🎤 **Voice Output** | Hindi text-to-speech via AWS Polly |
| ⚡ **Multi-Model engine** | Smart fallback across 7+ LLM providers |
| ⚙️ **Live Settings** | Switch models, languages, and API keys from the UI |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│         (Vite + Framer Motion + Markdown)            │
├─────────────────────────────────────────────────────┤
│              WebSocket + REST API                    │
├─────────────────────────────────────────────────────┤
│                FastAPI Backend                        │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │Orchestrat│→ │ Review Monk  │  │Codebase Sherpa│  │
│  │   or     │→ │ (Code Review)│  │(Code Explain) │  │
│  └──────────┘  └──────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────┤
│              Multi-Model LLM Engine                  │
│  Groq │ DeepSeek │ OpenAI │ AWS Bedrock │ Gemini    │
├─────────────────────────────────────────────────────┤
│                 AWS Services                         │
│  DynamoDB (Memory) │ Translate │ Polly (Voice)       │
│  Redis (Session Cache)                               │
└─────────────────────────────────────────────────────┘
```

---

## 🤖 Supported AI Models

| Provider | Model | Priority | Status |
|---|---|---|---|
| **Groq** | Llama 3.3 70B Versatile | 🥇 1st | ✅ Free, fastest |
| **DeepSeek** | DeepSeek Chat | 🥈 2nd | Requires credits |
| **OpenAI** | GPT-4o | 🥉 3rd | Requires credits |
| **AWS Bedrock** | Claude 3.5 Sonnet | 4th | Requires AWS setup |
| **Anthropic** | Claude 3.5 (Direct API) | 5th | Requires API key |
| **Google** | Gemini 2.0/2.5 Flash | 6th | Free tier (limited) |
| **Mock** | Demo Mode | Last | Always works |

The engine automatically falls through the priority chain if a provider fails or hits rate limits.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Groq API key](https://console.groq.com) (recommended)

### 1. Clone the repo
```bash
git clone https://github.com/Cyansiiii/CODESHERPA.git
cd CODESHERPA
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys (at minimum GROQ_API_KEY)

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 4. Open the app
Visit **http://localhost:5173** and start chatting!

---

## ⚙️ Environment Variables

Create a `backend/.env` file with the following:

```env
PROJECT_NAME=CodeSherpa
API_V1_STR=/api/v1

# AWS (for Bedrock, DynamoDB, Translate, Polly)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# LLM API Keys (add whichever you have)
GROQ_API_KEY=your_groq_key          # Free — recommended!
GEMINI_API_KEY=your_gemini_key      # Free tier available
OPENAI_API_KEY=your_openai_key      # Requires credits
DEEPSEEK_API_KEY=your_deepseek_key  # Requires credits
ANTHROPIC_API_KEY=your_anthropic_key

# GitHub Integration
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Infrastructure
REDIS_URL=redis://localhost:6379/0
DYNAMODB_TABLE_NAME=codesherpa_memory
```

> 💡 **Minimum setup**: Just add `GROQ_API_KEY` — everything else is optional!

---

## 📂 Project Structure

```
CodeSherpa/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── orchestrator.py      # Intent classification & routing
│   │   │   ├── review_monk.py       # Code review agent (Groq)
│   │   │   ├── codebase_sherpa.py   # Code explanation agent (Groq)
│   │   │   └── base_agent.py        # Shared agent base class
│   │   ├── services/
│   │   │   ├── bedrock_service.py   # Multi-model LLM engine
│   │   │   └── aws_services.py      # DynamoDB, Translate, Polly
│   │   ├── core/
│   │   │   ├── config.py            # Settings & env loading
│   │   │   └── redis_client.py      # Session cache
│   │   └── main.py                  # FastAPI app & routes
│   ├── requirements.txt
│   ├── Procfile                     # Railway deployment
│   ├── nixpacks.toml                # Railway build config
│   └── railway.json                 # Railway deploy config
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx         # Main chat + settings UI
│   │   │   └── HomePage.jsx         # Landing page
│   │   ├── App.jsx                  # Router
│   │   └── main.jsx                 # Entry point
│   └── index.html
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/models` | List available models & active provider |
| `POST` | `/api/models/switch` | Switch active AI model |
| `POST` | `/api/models/key` | Update API key for a provider |
| `POST` | `/api/chat` | Send message for AI processing |
| `GET` | `/api/aws-status` | Check AWS service status |
| `WS` | `/ws` | WebSocket for real-time chat |

---

## 🌍 Multilingual Support

CodeSherpa supports responses in:
- 🇬🇧 **English** — Default
- 🇮🇳 **Hindi** — Full translation via AWS Translate
- 🇮🇳 **Bengali** — Full translation
- 🇮🇳 **Tamil** — Full translation
- 🇮🇳 **Hinglish** — Mixed English + Hindi

Language can be changed from the **Settings** panel in the UI.

---

## 🚂 Deployment (Railway)

The project includes Railway deployment configs:

```bash
cd backend
git add Procfile nixpacks.toml railway.json
git push
```

Set these environment variables in Railway dashboard:
- `GROQ_API_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- Any other API keys you want to use

---

## 🛡️ AWS Services Used

| Service | Purpose |
|---|---|
| **AWS Bedrock** | Claude 3.5 Sonnet LLM (optional) |
| **DynamoDB** | Persistent conversation memory |
| **AWS Translate** | Hindi/Bengali/Tamil translation |
| **AWS Polly** | Text-to-speech (Hindi voice) |
| **Redis** | Session caching (falls back to in-memory) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is part of **AI FOR BHARAT** initiative.

---

<p align="center">
  <b>Built with 🏔️ CodeSherpa — Your AI Pair Programmer</b><br>
  <i>Namaste! 🙏 Happy Coding!</i>
</p>
