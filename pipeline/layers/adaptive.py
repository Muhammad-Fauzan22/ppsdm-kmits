from typing import Dict, Any

def ai_adaptive_engine(immersive_content: Dict[str, Any]):
    """
    Generates personalized learning path.
    """
    print("   [Mock] Generating AI Adaptive Learning Path...")
    
    learning_path = [
        {"step": 1, "activity": "Watch Intro Video", "duration": "5m"},
        {"step": 2, "activity": "VR Exploration", "duration": "15m", "link": immersive_content.get("vr_classroom_link")},
        {"step": 3, "activity": "Adaptive Quiz", "duration": "10m"}
    ]
    
    ai_tutor = {
        "name": "BukuBot",
        "personality": "Socratic Method",
        "avatar_url": "https://avatars.bukabuku.com/bot_v1.png"
    }
    
    return {
        "learning_path": learning_path,
        "ai_tutor": ai_tutor
    }
