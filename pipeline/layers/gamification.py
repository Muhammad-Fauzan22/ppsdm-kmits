from typing import Dict, Any, List
import json
import random

class GamificationEngine:
    """Generate game-based learning content from book material"""
    
    def __init__(self):
        self.games_templates = {
            "quiz_battle": "quiz_game_template.html",
            "concept_puzzle": "puzzle_template.html",
            "virtual_lab": "lab_simulator.html",
            "story_adventure": "choose_your_adventure.html"
        }
        
    def generate_gamified_content(self, book_content: Dict[str, Any], learning_objectives: List[str] = None):
        """
        Generate multiple game formats from book content
        """
        print("   [Layer 5] Generifying content into games...")
        games = {}
        
        # 1. Quiz Battle Game (like Kahoot!)
        # Extract questions from assessment generation or existing content
        questions = book_content.get("assessment_questions", [])
        if not questions and "questions" in book_content: 
             questions = book_content["questions"]
             
        games["quiz_battle"] = self.create_quiz_game(
            questions,
            template="battle_royale",
            features=["leaderboard", "powerups", "teams"]
        )
        
        # 2. Concept Puzzle Game
        key_concepts = book_content.get("key_concepts", [])
        if key_concepts:
            games["concept_puzzle"] = self.create_puzzle_game(
                key_concepts,
                puzzle_type="crossword",  # or "word_search", "matching"
                difficulty="adaptive"
            )
        
        # 3. Virtual Lab Simulation (for STEM books)
        if self.is_stem_content(book_content):
            games["virtual_lab"] = self.create_simulation(
                book_content.get("experiments", []),
                engine="three.js",
                interactivity="high"
            )
        
        # 4. Choose-Your-Own-Adventure Story
        if "narrative_elements" in book_content:
            games["story_adventure"] = self.create_interactive_story(
                book_content.get("narrative_elements", []),
                branching_factor=3,
                endings=5
            )
        
        return {
            "games": games,
            "integration_code": self.generate_embed_codes(games),
            "mobile_app_ready": self.package_for_mobile(games)
        }
    
    def create_quiz_game(self, questions, template="battle_royale", **options):
        """Create interactive quiz game"""
        # Use open-source game engine: Phaser.js or Kaboom.js logic placeholder
        
        # Convert questions to game format
        game_questions = []
        for i, q in enumerate(questions):
            # Adapt structure: handle both dict keys or object attributes if strictly typed
            question_text = q.get("question", "") if isinstance(q, dict) else getattr(q, "question", "")
            options_list = q.get("options", []) if isinstance(q, dict) else getattr(q, "options", [])
            correct = q.get("correct_answer", "") if isinstance(q, dict) else getattr(q, "correct_answer", "")
            
            game_q = {
                "question": question_text,
                "answers": options_list,
                "correct": correct,
                "points": 100, 
                "time_limit": 30,
                "powerups": ["Skip", "50/50"]
            }
            game_questions.append(game_q)
        
        # Add game mechanics
        game_mechanics = {
            "lives": 3,
            "streak_multiplier": True,
            "hint_system": True,
            "boss_battles": len(game_questions) // 5 if game_questions else 0,
            "reward_system": {
                "badges": ["fast_thinker", "perfectionist", "streak_master"],
                "levels": ["novice", "adept", "expert", "master"],
                "unlockables": ["themes", "characters", "powerups"]
            }
        }
        
        return {
            "html": self.render_game_html(template, game_questions, game_mechanics),
            "js": "// Game Logic Generated",
            "assets": [],
            "config": {
                "scoring_system": "weighted",
                "multiplayer": True,
                "offline_mode": True
            }
        }

    def create_puzzle_game(self, concepts, puzzle_type, difficulty):
        return {
            "type": puzzle_type,
            "concepts": concepts,
            "difficulty": difficulty,
            "html": f"<!-- Puzzle Game: {puzzle_type} -->"
        }

    def is_stem_content(self, book_content):
        # Basic keyword check to determine if virtual lab is needed
        keywords = ["physics", "math", "chemistry", "biology", "science", "experiment", "lab"]
        text_dump = str(book_content).lower()
        return any(k in text_dump for k in keywords)

    def create_simulation(self, experiments, engine, interactivity):
        return {
            "engine": engine,
            "experiments": experiments,
            "interactivity": interactivity,
            "html": "<!-- Three.js Lab Simulation -->"
        }

    def create_interactive_story(self, specific_elements, branching_factor, endings):
        return {
            "type": "story",
            "title": "Interactive Adventure",
            "branching": branching_factor,
            "endings": endings
        }

    def generate_embed_codes(self, games):
        return {k: f"<iframe src='game_{k}.html' width='100%' height='600px'></iframe>" for k in games}

    def package_for_mobile(self, games):
        # Placeholder for PWA/Capacitor packaging logic
        return True

    def render_game_html(self, template, questions, mechanics):
        # In a real impl, this would load a Jinja2 template
        return f"<!-- Game Template: {template} -->\n<script>const questions = {json.dumps(questions)};</script>"

# Adapter function for pipeline compatibility
def gamification_engine(multimedia_content: Dict[str, Any]):
    engine = GamificationEngine()
    
    # In the main pipeline flow, we assume the input dictionary aggregates previous layers.
    # We attempt to find the original book content/metadata here.
    
    # Fallback/Mock content if not present
    book_content = multimedia_content if isinstance(multimedia_content, dict) else {}
    
    # Verify if we have necessary keys, else add mocks for demonstration if empty
    if "key_concepts" not in book_content:
        book_content["key_concepts"] = ["Concept A", "Concept B"]
    if "assessment_questions" not in book_content:
        book_content["assessment_questions"] = [
            {"question": "What is 2+2?", "options": ["3", "4", "5"], "correct_answer": "4"},
            {"question": "What is the capital of France?", "options": ["London", "Paris", "Berlin"], "correct_answer": "Paris"}
        ]
        
    return engine.generate_gamified_content(book_content)

