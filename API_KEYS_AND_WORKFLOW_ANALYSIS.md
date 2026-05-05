# 🔍 LevelUP: API Keys & Workflow Readiness Analysis

**Date:** May 5, 2026  
**Status:** ⚠️ **PARTIALLY READY** — Missing critical API keys and configuration

---

## 📋 Executive Summary

| Aspect | Status | Severity |
|--------|--------|----------|
| **Frontend Setup** | ❌ Missing config | 🔴 CRITICAL |
| **Backend Setup** | ❌ Missing config | 🔴 CRITICAL |
| **Firebase Config** | ❌ Not initialized | 🔴 CRITICAL |
| **AI API Keys** | ❌ Not configured | 🔴 CRITICAL |
| **Database** | ⚠️ Configured (Firestore) | 🟡 NEEDS SETUP |
| **Authentication** | ⚠️ Framework ready | 🟡 NEEDS KEYS |
| **API Workflow** | ✅ Architecture complete | 🟢 READY |
| **Deployment** | ⚠️ Config exists | 🟡 NEEDS ENV VARS |

---

## 🔑 Required API Keys & Credentials

### **CRITICAL - Missing in Frontend**

#### 1. **Firebase Configuration** (6 variables)
```env
VITE_FIREBASE_API_KEY=❌ NOT SET
VITE_FIREBASE_AUTH_DOMAIN=❌ NOT SET
VITE_FIREBASE_PROJECT_ID=❌ NOT SET
VITE_FIREBASE_STORAGE_BUCKET=❌ NOT SET
VITE_FIREBASE_MESSAGING_SENDER_ID=❌ NOT SET
VITE_FIREBASE_APP_ID=❌ NOT SET
```

**Where to get:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Add web app (Web/JavaScript)
4. Copy config from "Your web app's Firebase config"
5. Extract these 6 values

**Impact:** ❌ **Frontend will NOT load** — Firebase auth required for login

#### 2. **Backend API URL**
```env
VITE_API_URL=❌ NOT SET
# Should be: http://localhost:8000 (dev) or https://skillroute-backend.onrender.com (prod)
```

**Impact:** ❌ **API calls will fail** — All requests go to undefined endpoint

---

### **CRITICAL - Missing in Backend**

#### 3. **Firebase Service Account** (1 of 2 options required)

**Option A: File Path (Recommended)**
```env
FIREBASE_SERVICE_ACCOUNT_PATH=❌ NOT SET
# Example: ./firebase-service-account.json
```

**Option B: Inline JSON**
```env
FIREBASE_SERVICE_ACCOUNT=❌ NOT SET
# JSON string: {"type": "service_account", "project_id": "...", ...}
```

**Where to get:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Downloads as `serviceAccountKey.json`
4. **NEVER commit this file to Git** (add to `.gitignore`)
5. For deployment: copy the entire JSON and paste as `FIREBASE_SERVICE_ACCOUNT` env var

**Impact:** ❌ **Backend cannot authenticate with Firestore** — Database access fails

---

#### 4. **Azure OpenAI API Keys** (4 variables)
```env
AZURE_OPENAI_API_KEY=❌ NOT SET
AZURE_OPENAI_ENDPOINT=❌ NOT SET
AZURE_OPENAI_API_VERSION=❌ NOT SET (default: 2024-08-01)
AZURE_OPENAI_DEPLOYMENT_NAME=❌ NOT SET (default: gpt-4o-mini)
```

**Where to get:**
1. Azure Portal → Azure OpenAI Service
2. Create resource in region
3. Deploy model (gpt-4o-mini or gpt-4)
4. Keys page → copy API Key and Endpoint
5. Check deployment name

**Impact:** ⚠️ **AI features degrade gracefully** — Falls back to mock responses, app still works

---

#### 5. **Frontend URL for CORS** (Optional but recommended)
```env
FRONTEND_URL=❌ NOT SET
# Example: https://levelup.vercel.app
```

**Impact:** ⚠️ **Minor** — CORS configured for hardcoded origins, but env var overrides

---

## ✅ What IS Ready

### **Frontend**
- ✅ Vite build system configured
- ✅ React + Tailwind setup complete
- ✅ Firebase SDK installed
- ✅ Router configured
- ✅ Component structure ready
- ✅ Axios HTTP client ready (awaiting API URL)
- ✅ **NEW:** TypeScript infrastructure (25+ files)
- ✅ **NEW:** Zustand state management ready
- ✅ **NEW:** React Query hooks ready

### **Backend**
- ✅ FastAPI framework configured
- ✅ CORS middleware setup (allows localhost + vercel)
- ✅ Route structure complete (5 routers registered):
  - `career_router` — Career path decision
  - `students_router` — Student profile management
  - `progress_router` — Progress tracking
  - `gap_analyzer_router` — Skill gap analysis
  - `ai_router` — AI agent endpoints
- ✅ Health check endpoint (`/health`)
- ✅ Root endpoint (`/`)
- ✅ Error handling framework
- ✅ Firebase authentication middleware ready

### **Database**
- ✅ Firestore enabled (Google Cloud)
- ✅ Collections structure ready (students, skills, tasks, etc.)
- ✅ Lazy loading DB connection (safe boot)

### **Deployment**
- ✅ `render.yaml` configured for Render
- ✅ `Procfile` ready for deployment
- ✅ Environment variables defined
- ✅ Python 3.11 specified
- ✅ spaCy model auto-download enabled

---

## 🔄 API Workflow Architecture

### **Frontend → Backend Flow** (Ready to go once keys are set)

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React + TypeScript + Zustand + React Query)       │
│                                                              │
│  1. User Login → Firebase Auth → ID Token                   │
│  2. Store token in Zustand (useAppStore)                    │
│  3. Axios interceptor injects: "Authorization: Bearer {JWT}"│
│  4. Call API endpoint (http://localhost:8000/...)           │
└────────────────────────────────────────┬────────────────────┘
                                        │
                                        │ HTTPS/REST
                                        │
┌────────────────────────────────────────▼────────────────────┐
│ BACKEND (FastAPI + Python)                                  │
│                                                              │
│  1. Receive HTTP request with Authorization header          │
│  2. Verify Firebase token (verify_firebase_token)           │
│  3. Extract user_id from token claims                       │
│  4. Query Firestore for user data                           │
│  5. Call AI service if needed (Azure OpenAI)               │
│  6. Return JSON response                                    │
└────────────────────────────────────────┬────────────────────┘
                                        │
                                        │ JSON
                                        │
┌────────────────────────────────────────▼────────────────────┐
│ FRONTEND (React Query handles caching + retry)              │
│                                                              │
│  1. Receive response                                        │
│  2. Update Zustand store                                    │
│  3. Render UI with new data                                │
│  4. Cache response for 5 minutes                            │
└─────────────────────────────────────────────────────────────┘
```

### **Available Endpoints** (Once backend is running)

```bash
# Backend Health
GET  /health                          → {"status": "healthy"}
GET  /                                → {"app": "LevelUP", "env": "...", "status": "running"}

# Students (Firebase required)
GET  /students                        → Get all students
GET  /students/{student_id}           → Get student profile
POST /students                        → Create student
PUT  /students/{student_id}           → Update student

# Career Path (AI + Firestore required)
POST /career/analyze                  → Get AI career recommendations
GET  /career/{student_id}/path        → Get student's career path

# Progress Tracking (Firestore required)
GET  /progress/{student_id}           → Get student progress
POST /progress/{student_id}/log       → Log new progress

# Skill Gap Analysis (AI + Firestore required)
POST /gap/analyze                     → Analyze resume for skill gaps
GET  /gap/{student_id}/report         → Get gap analysis report

# AI (Azure OpenAI required)
POST /ai/suggest-roadmap              → Generate learning roadmap
POST /ai/ask                          → Ask AI question
```

---

## 🚀 Step-by-Step Setup Guide

### **STEP 1: Firebase Setup (15 minutes)**

```bash
# 1. Go to https://console.firebase.google.com
# 2. Click "Create Project" → Enter "LevelUP" or similar
# 3. Enable Google Analytics (optional)
# 4. Wait for project creation
# 5. Click "Web" icon to add Firebase to web app
# 6. Copy the config object (firebaseConfig)

# 7. Create .env in frontend/
cd frontend
touch .env

# 8. Add to .env:
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_API_URL=http://localhost:8000
```

### **STEP 2: Backend Firebase Service Account (10 minutes)**

```bash
# 1. Firebase Console → Project Settings → Service Accounts tab
# 2. Click "Generate New Private Key"
# 3. Save as backend/firebase-service-account.json
# 4. Create .env in backend/
cd ../backend
touch .env

# 5. Add to .env:
PROJECT_NAME=LevelUP
ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# 6. Optional but recommended: Enable Firestore database
#    Firebase Console → Firestore Database → Create Database
#    Start in test mode (NOT production — for development)
```

### **STEP 3: Azure OpenAI Setup (15 minutes) — Optional but recommended**

```bash
# 1. Go to https://portal.azure.com
# 2. Create "Azure OpenAI Service" resource
# 3. Select region (e.g., East US)
# 4. Pricing tier: Standard (S0)
# 5. Keys & Endpoint → copy API Key and Endpoint
# 6. Model Deployments → Deploy "gpt-4o-mini"
# 7. Copy deployment name

# 8. Add to backend/.env:
AZURE_OPENAI_API_KEY=YOUR_KEY_HERE
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-08-01
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

**Cost note:** First 1M tokens/month free, then ~$0.15/1M tokens. Rough estimate: $1-5/month for development.

### **STEP 4: Test Locally**

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm  # For NLP (optional)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Open http://localhost:5173
# Try to sign up/login
# Check browser console and backend logs for errors
```

### **STEP 5: Deploy to Production (Optional)**

```bash
# Backend: Render.com
# 1. Connect GitHub repo to Render
# 2. Select "New Web Service"
# 3. Choose repo, branch=main, rootDir=backend
# 4. Runtime: Python
# 5. Add environment variables (same as .env)
# 6. Deploy

# Frontend: Vercel
# 1. Connect GitHub to Vercel
# 2. Import project
# 3. Set rootDir=frontend
# 4. Add VITE_FIREBASE_* and VITE_API_URL env vars
# 5. Deploy

# Update FRONTEND_URL in backend .env to Vercel URL
```

---

## ⚠️ Critical Blockers (Cannot run without)

| Blocker | Why | Solution |
|---------|-----|----------|
| **Firebase Web Config** | Frontend cannot initialize Firebase SDK | Follow STEP 1 above |
| **Firebase Service Account** | Backend cannot access Firestore | Follow STEP 2 above |
| **VITE_API_URL** | Frontend doesn't know where backend is | Set in frontend/.env |

---

## 🟡 Degradation Modes (Can run with limitations)

| Missing | Behavior | Impact |
|---------|----------|--------|
| **Azure OpenAI keys** | AI fallback to mock responses | Career suggestions hardcoded (still useful) |
| **Firestore database** | Error on first query | Login works, but profile save fails |
| **spaCy model** | NLP features skip | Gap analyzer works but less accurate |

---

## ✅ Verification Checklist

```bash
# Run these to verify setup

# 1. Frontend environment
cd frontend
cat .env
npm run type-check  # Should pass: 0 errors

# 2. Backend environment
cd ../backend
cat .env
python -c "from app.utils.firebase import init_firebase_app; init_firebase_app(); print('Firebase initialized!')"

# 3. API reachability
curl http://localhost:8000/health

# 4. Frontend API connection
# Open DevTools → Network → make any API call → should hit http://localhost:8000
```

---

## 📊 Current Status Summary

```
FRONTEND:
  ├─ ✅ Infrastructure (TypeScript, Zustand, React Query)
  ├─ ✅ Build system (Vite)
  ├─ ✅ Firebase SDK
  ├─ ✅ HTTP client (Axios with interceptors)
  └─ ❌ .env variables (CRITICAL)

BACKEND:
  ├─ ✅ API routes (5 routers)
  ├─ ✅ Framework (FastAPI)
  ├─ ✅ CORS configuration
  ├─ ✅ Firebase utils
  ├─ ✅ AI service structure
  └─ ❌ .env variables (CRITICAL)

DATABASE:
  ├─ ✅ Firestore SDK
  ├─ ✅ Connection logic
  └─ ⚠️ Database needs creation in Firebase Console

DEPLOYMENT:
  ├─ ✅ render.yaml (Render backend)
  ├─ ✅ Procfile (Heroku-compatible)
  ├─ ✅ vercel.json (Vercel frontend)
  └─ ⚠️ Environment variables need setup on deployment platforms

TIME TO PRODUCTION: ~30 minutes (once keys are obtained)
```

---

## 🎯 Next Actions (Priority Order)

1. **TODAY:** Setup Firebase (STEP 1) — 15 min
2. **TODAY:** Setup Firebase Backend (STEP 2) — 10 min
3. **OPTIONAL:** Setup Azure OpenAI (STEP 3) — 15 min
4. **TODAY:** Test locally (STEP 4) — 10 min
5. **THIS WEEK:** Deploy (STEP 5) — 30 min

---

## 📞 Troubleshooting

### **Frontend won't load**
```
Error: import.meta.env.VITE_FIREBASE_API_KEY is undefined
→ Solution: Check frontend/.env has all 6 Firebase variables
```

### **Backend gives "Firebase not initialized" error**
```
Error: FIREBASE_SERVICE_ACCOUNT_PATH not found
→ Solution: Check backend/.env and verify file path exists
→ Or set FIREBASE_SERVICE_ACCOUNT as inline JSON
```

### **API calls return 401 Unauthorized**
```
Error: Token verification failed
→ Solution: Ensure Firebase tokens match between frontend + backend
→ Check: Frontend is using same Firebase project as backend service account
```

### **AI features return fallback responses**
```
Note: Using mock responses from _ask_ai fallback
→ This is OK! The app still works. Add Azure keys when ready.
```

---

**Generated:** May 5, 2026  
**App Status:** ⚠️ Ready to run once API keys are configured
