# Roadmap Adoption Flow - Complete Test Guide

## System Architecture

```
Frontend (React/Vite)
    ↓
    handleAdoptRoadmap()
    ├─ Gets Firebase ID token
    ├─ Sends POST to /api/v1/adopt-roadmap
    └─ Creates local skills in SkillContext
    
Backend (FastAPI)
    ↓
    /api/v1/adopt-roadmap endpoint
    ├─ Verifies Firebase token (user_id)
    ├─ Validates gap_analysis & roadmap_title
    ├─ Converts phases to roadmap structure
    └─ Calls save_active_roadmap()
    
Database (Firestore)
    ↓
    users/{user_id}/active_roadmap/current
    ├─ career_decision (title, confidence, skills)
    ├─ learning_roadmap (phases, milestones, resources)
    ├─ progress (completed_phases, streak_days)
    └─ updated_at (timestamp)
```

## End-to-End Test Procedure

### Phase 1: Frontend Verification

1. **Open Browser DevTools** (F12)
   - Go to Console tab
   - Look for timestamp entries

2. **Navigate to Skill Gap Analyzer**
   - Fill in job description
   - Upload resume
   - Click "Analyze"

3. **When Analysis Complete, Click "Set as My Roadmap"**
   - **Watch Console for logs:**
     ```
     🚀 Adopting roadmap: { title: '...', missingSkills: N }
     ✅ Backend saved roadmap successfully
     📁 Creating Gap Analysis category...
     ✅ Category created: <uuid>
     📚 Creating X skills...
     ✅ Created skill: <skill name>
     ✨ Adoption complete! Created X skills
     🎯 Ready to navigate to dashboard
     ```

4. **Expected Outcomes:**
   - Button changes to green "Go to Dashboard" text
   - No error message displayed
   - Console shows all emoji-marked logs

### Phase 2: Backend Verification

5. **Backend Console Check**
   - Terminal running `npm run dev` or `python -m uvicorn app.main:app --reload`
   - Look for logs from `adopt_gap_roadmap()`:
     ```
     📝 Saving roadmap for user <user_id>...
     📋 Preserve progress enabled. Found existing roadmap: False
     📊 Fresh progress: 0/<count> phases
     ✅ Roadmap saved successfully!
       📍 Path: users/<user_id>/active_roadmap/current
       🎯 Career: <career title>
       📚 Phases: <count>
       ⏱️  Duration: <months> months
     ```

### Phase 3: Firestore Verification

6. **Firebase Console Check**
   - Go to https://console.firebase.google.com
   - Select your project
   - Firestore Database → Collections
   - Navigate to: `users` → `<current_user_id>` → `active_roadmap` → `current`
   - **Document should contain:**
     ```json
     {
       "career_decision": {
         "career": "...",
         "reasoning": "Adopted from Skill Gap Analyzer...",
         "confidence": 75,
         "key_strengths": [...],
         "skill_gaps": [...],
         "time_to_job_ready": "~8 weeks",
         ...
       },
       "learning_roadmap": {
         "duration_months": 2,
         "roadmap": [
           {
             "phase": "Foundation Phase",
             "status": "pending",
             "milestones": [...],
             ...
           },
           ...
         ],
         "total_estimated_hours": 200,
         "weeks_to_readiness": 8
       },
       "progress": {
         "completed_phases": 0,
         "total_phases": 3,
         "streak_days": 0,
         "last_activity_date": null
       },
       "updated_at": <timestamp>
     }
     ```

### Phase 4: Frontend Skills Verification

7. **Check Portfolio Page**
   - Click on Portfolio in nav
   - Should see "Gap Analysis" category
   - Should see created skills listed
   - Each skill should show:
     - Status: "NOT_STARTED"
     - Priority: "HIGH"
     - Progress: 0%

### Phase 5: Dashboard Verification

8. **Check Dashboard**
   - Go to Dashboard
   - Should display:
     - Career title from adoption
     - Confidence percentage
     - Phase cards for each roadmap phase
     - Milestone list under each phase
   - Should show progress (0/3 phases completed)

## Troubleshooting Guide

### Issue: Console shows no logs

**Possible Causes:**
1. Frontend not connected to backend
2. Backend endpoint not responding
3. User not authenticated

**Solutions:**
```
// In browser console, test connection:
const token = await firebase.auth().currentUser?.getIdToken()
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)  // Should show status: "running"
```

### Issue: "❌ Adoption failed" error message

**Check in this order:**
1. **Firebase authentication:**
   - Is user signed in? `console.log(auth.currentUser)`
   - Is token valid? Check Firebase Console Authentication

2. **Backend endpoint:**
   - Is backend running? Check terminal for FastAPI startup
   - Try: `curl http://localhost:8000/health`

3. **Network request:**
   - Check Network tab in DevTools
   - Look for request to `/api/v1/adopt-roadmap`
   - Status should be 200
   - Response should have `"status": "ok"`

4. **Backend error response:**
   - Check backend console for error logs
   - Common errors:
     - `HTTPException 400`: gap_analysis validation failed
     - `HTTPException 401`: Firebase token invalid/expired
     - `HTTPException 500`: Firestore write error

### Issue: Firestore document not created

**Check:**
1. Firestore connection in backend:
   ```python
   # In backend terminal, test:
   from app.utils.firebase import db
   test_doc = db.collection("test").document("test").set({"status": "ok"})
   print("✅ Firestore connected")
   ```

2. User ID extraction:
   - Add to backend: `print(f"User ID: {user_id}")`
   - Verify ID is not None/empty

3. Document path is correct:
   - Path: `users/{user_id}/active_roadmap/current`
   - Check actual user_id in logs

### Issue: Skills not appearing in Portfolio

**Check:**
1. SkillContext is working:
   - `console.log(skills, categories)` in DevTools
   - Should show created "Gap Analysis" category

2. Skills creation succeeded:
   - Console should show `✅ Created skill:` logs
   - `skillsCreatedCount` should be > 0

3. Portfolio page is reading from context:
   - Check Portfolio.jsx for `useSkillContext()` hook
   - Verify it's rendering category list

## Success Criteria Checklist

- [ ] Frontend console shows all emoji logs (🚀✅📁📚✨)
- [ ] Backend console shows logs starting with 📝
- [ ] No errors in DevTools Console
- [ ] No errors in backend terminal
- [ ] Firestore document exists at correct path
- [ ] Document contains all expected fields
- [ ] Skills appear in Portfolio with correct category
- [ ] Dashboard displays roadmap phases
- [ ] No console warnings or errors

## Quick Reference - Logging Points

| Log | Location | Expected Output |
|-----|----------|-----------------|
| 🚀 | Frontend, start adoption | `Adopting roadmap: { title: '...', missingSkills: N }` |
| ✅ | Frontend, after backend response | `Backend saved roadmap successfully` |
| 📁 | Frontend, creating category | `Creating Gap Analysis category...` |
| 📚 | Frontend, creating skills | `Creating X skills...` |
| ✨ | Frontend, adoption complete | `Adoption complete! Created X skills` |
| 📝 | Backend, start save | `Saving roadmap for user <id>...` |
| 📋 | Backend, preserve check | `Preserve progress enabled...` |
| ✅ | Backend, after save | `Roadmap saved successfully!` |
| 📍 | Backend, path info | `Path: users/<id>/active_roadmap/current` |

## Common Success Scenario

```
1. User opens Skill Gap Analyzer → Fills in form → Clicks Analyze
   ✓ Shows gap analysis with matched/missing skills
   ✓ "Set as My Roadmap" button becomes active

2. User clicks "Set as My Roadmap"
   ✓ Frontend sends POST to backend
   ✓ Backend validates and saves to Firestore
   ✓ Frontend creates local skills
   ✓ Button changes to "Go to Dashboard" (green)

3. User clicks "Go to Dashboard"
   ✓ Roadmap displays with phases and milestones
   ✓ Progress shows 0/N phases completed
   ✓ Skills appear in Portfolio

4. Backend/Firestore Verification:
   ✓ Document created at users/{user_id}/active_roadmap/current
   ✓ All phases marked as "pending"
   ✓ Progress initialized to 0 completed phases
   ✓ Timestamp shows current adoption time
```

## Performance Notes

- Adoption should complete in < 2 seconds
- Firestore write typically < 500ms
- Backend should respond within 1 second
- If slower, check:
  - Network latency: `ping localhost:8000`
  - Firestore quota: Firebase Console → Firestore → Stats
  - Backend load: Check CPU usage during adoption

