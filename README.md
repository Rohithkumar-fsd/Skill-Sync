# 🎯 Skill-Sync

> AI-powered career path decision and personalized learning roadmap platform


## 📌 Overview

Skill-Sync helps students choose the right career and learn it in a structured, time-bound way.  
It **decides** the best-fit career path and builds an **adaptive learning roadmap** based on your profile.

Unlike traditional career guidance tools, Skill-Sync doesn't just give advice —  
it **analyzes**, **decides**, and **generates** a complete learning journey tailored to you.

## 🚀 Features

- 🤖 AI-powered career path decision making
- 🗺️ Personalized, time-bound learning roadmap
- 🔐 Firebase authentication & secure sessions
- 📊 Comprehensive progress tracking
- ⚡ Fast, modern React + Tailwind UI
- 🧠 Adaptive to your skills, time & learning pace

## 🧩 How It Works

| Step | Description |
|------|-------------|
| 1. **Analyze** | Evaluates your interests, skills, time & learning pace |
| 2. **Decide** | AI selects the best-fit career path for you |
| 3. **Generate** | Creates a personalized, time-bound roadmap |
| 4. **Track** | Monitor your progress as you learn |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS |
| Backend | FastAPI, Python 3.8+ |
| AI | OpenAI API (Azure) |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |

## 📂 Project Structure
Skill-Sync/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   └── public/
│
└── README.md

---

## ⚙️ Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- Firebase project
- Azure OpenAI API key

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

| URL | Description |
|-----|-------------|
| http://127.0.0.1:8000 | API Root |
| http://127.0.0.1:8000/docs | Swagger Docs |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:

```env
PROJECT_NAME=Skill-Sync
ENV=development
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-credentials.json
FRONTEND_URL=http://localhost:5173
```

## 💡 Future Enhancements

- 📜 Detailed course recommendations per topic
- 🏆 Gamification and achievement badges
- 👥 Peer learning and community features
- 📱 Mobile app version
- 🌐 Multi-language support
