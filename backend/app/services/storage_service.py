from app.utils.firebase import db
from datetime import datetime


def save_career_analysis(
    user_id: str,
    profile: dict,
    career_decision: dict,
    roadmap: dict
):
    data = {
        "profile": profile,
        "career_decision": career_decision,
        "roadmap": roadmap,
        "created_at": datetime.utcnow()
    }

    db.collection("users") \
      .document(user_id) \
      .collection("analyses") \
      .add(data)

    save_active_roadmap(user_id, career_decision, roadmap)

    return True


def save_active_roadmap(user_id: str, career_decision: dict, roadmap: dict, preserve_progress: bool = False):
    """
    Save the active roadmap for a user to Firestore.
    
    Args:
        user_id: Firebase user ID
        career_decision: Career analysis with title, reasoning, confidence, etc.
        roadmap: Roadmap structure with phases, milestones, resources
        preserve_progress: If True, preserves completion status from existing roadmap
    
    Returns:
        True if successful
    """
    try:
        print(f"Saving roadmap for user {user_id}...")
        
        existing_data = None
        if preserve_progress:
            existing_data = get_active_roadmap(user_id)
            print(f"Preserve progress enabled. Found existing roadmap: {existing_data is not None}")
        
        # Ensure all phases have status
        if "roadmap" in roadmap:
            for idx, phase in enumerate(roadmap["roadmap"]):
                if existing_data and preserve_progress:
                    old_roadmap = existing_data.get("learning_roadmap", {}).get("roadmap", [])
                    if idx < len(old_roadmap):
                        old_phase = old_roadmap[idx]
                        if old_phase.get("status") == "completed":
                            phase["status"] = "completed"
                            phase["completed_at"] = old_phase.get("completed_at")
                            print(f"  Phase {idx+1} preserved as completed")
                        else:
                            phase["status"] = "pending"
                            phase["completed_at"] = None
                    else:
                        phase["status"] = "pending"
                        phase["completed_at"] = None
                else:
                    phase["status"] = "pending"
                    phase["completed_at"] = None
        
        # Build progress tracking
        if existing_data and preserve_progress:
            completed_count = sum(1 for p in roadmap.get("roadmap", []) if p.get("status") == "completed")
            progress_data = {
                "completed_phases": completed_count,
                "total_phases": len(roadmap.get("roadmap", [])),
                "streak_days": existing_data.get("progress", {}).get("streak_days", 0),
                "last_activity_date": existing_data.get("progress", {}).get("last_activity_date")
            }
            print(f"  Progress preserved: {completed_count}/{len(roadmap.get('roadmap', []))} phases completed")
        else:
            progress_data = {
                "completed_phases": 0,
                "total_phases": len(roadmap.get("roadmap", [])),
                "streak_days": 0,
                "last_activity_date": None
            }
            print(f"  Fresh progress: 0/{len(roadmap.get('roadmap', []))} phases")

        data = {
            "career_decision": career_decision,
            "learning_roadmap": roadmap,
            "progress": progress_data,
            "updated_at": datetime.utcnow()
        }

        # Save to Firestore
        doc_ref = db.collection("users").document(user_id).collection("active_roadmap").document("current")
        doc_ref.set(data)
        
        print(f"Roadmap saved successfully!")
        print(f"   Path: users/{user_id}/active_roadmap/current")
        print(f"   Career: {career_decision.get('career', 'N/A')}")
        print(f"   Phases: {len(roadmap.get('roadmap', []))}")
        print(f"   Duration: {roadmap.get('duration_months', 0)} months")
        
        return True
        
    except Exception as e:
        print(f"Error saving roadmap: {str(e)}")
        raise


def get_active_roadmap(user_id: str):
    doc = db.collection("users").document(user_id).collection("active_roadmap").document("current").get()
    if doc.exists:
        return doc.to_dict()
    return None


def update_phase_status(user_id: str, phase_index: int, status: str):
    if status not in {"pending", "completed"}:
        return False

    ref = db.collection("users").document(user_id).collection("active_roadmap").document("current")
    doc = ref.get()
    
    if not doc.exists:
        return False
        
    data = doc.to_dict()
    roadmap = data.get("learning_roadmap", {}).get("roadmap", [])
    
    if 0 <= phase_index < len(roadmap):
        roadmap[phase_index]["status"] = status
        if status == "completed":
            roadmap[phase_index]["completed_at"] = datetime.utcnow().isoformat()
            
            completed_count = sum(1 for p in roadmap if p.get("status") == "completed")
            data["progress"]["completed_phases"] = completed_count
            
            update_streak(data["progress"])
        else:
            roadmap[phase_index]["completed_at"] = None
            completed_count = sum(1 for p in roadmap if p.get("status") == "completed")
            data["progress"]["completed_phases"] = completed_count
            
        ref.update({
            "learning_roadmap.roadmap": roadmap,
            "progress": data["progress"],
            "updated_at": datetime.utcnow()
        })
        return True
        
    return False


def update_streak(progress_data: dict):
    now = datetime.utcnow()
    last_active = progress_data.get("last_activity_date")
    
    if last_active:
        last_date = datetime.fromisoformat(last_active).date()
        today = now.date()
        diff = (today - last_date).days
        
        if diff == 1:
            progress_data["streak_days"] += 1
        elif diff > 1:
            progress_data["streak_days"] = 1
    else:
        progress_data["streak_days"] = 1
        
    progress_data["last_activity_date"] = now.isoformat()


def get_student_profile(user_id: str):
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        data = doc.to_dict()
        return data.get("profile")
    return None


def save_student_profile(user_id: str, profile: dict):
    try:
        db.collection("users").document(user_id).set({
            "profile": profile,
            "updated_at": datetime.utcnow()
        }, merge=True)
        return True
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")


def delete_active_roadmap(user_id: str):
    try:
        ref = db.collection("users").document(user_id).collection("active_roadmap").document("current")
        doc = ref.get()
        
        if doc.exists:
            ref.delete()
            return True
        else:
            return False
    except Exception as e:
        raise Exception(f"Failed to delete roadmap: {str(e)}")

