"""
Layer 10: Interactive Scenarios (Branching Learning Paths)
Generate interactive scenarios for immersive learning
Supports Indonesian and English output
"""

from typing import Dict, Any, List, Optional
import json
from dataclasses import dataclass, asdict
from enum import Enum
import uuid


class ScenarioType(Enum):
    CASE_STUDY = "case_study"
    SIMULATION = "simulation"
    ROLE_PLAY = "role_play"
    DECISION_TREE = "decision_tree"
    PROBLEM_SOLVING = "problem_solving"


@dataclass
class ScenarioChoice:
    """Represents a choice in a scenario"""
    id: str
    text: str
    consequence: str
    next_node_id: Optional[str] = None
    feedback: str = ""
    points: int = 0
    skills_tested: List[str] = None


@dataclass
class ScenarioNode:
    """Represents a node in the scenario tree"""
    id: str
    type: str  # "situation", "decision", "outcome", "reflection"
    title: str
    description: str
    media_url: Optional[str] = None
    choices: List[ScenarioChoice] = None
    is_endpoint: bool = False
    learning_objectives: List[str] = None


@dataclass
class LearningScenario:
    """Represents a complete interactive scenario"""
    id: str
    title: str
    description: str
    type: str
    difficulty: str
    estimated_time: str
    start_node_id: str
    nodes: List[ScenarioNode]
    learning_outcomes: List[str]
    badges_unlocked: List[str]


class InteractiveScenarioGenerator:
    """
    Generate branching scenarios for immersive learning experiences
    """
    
    DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced", "expert"]
    
    def __init__(self, language: str = "id"):
        self.language = language
        
    def generate_scenarios(self, book_content: Dict[str, Any],
                          scenario_type: str = "case_study") -> Dict[str, Any]:
        """
        Generate interactive scenarios from book content
        
        Args:
            book_content: Dictionary containing book data
            scenario_type: Type of scenario to generate
            
        Returns:
            Dictionary with scenarios data
        """
        print(f"   [Layer 10] Generating Interactive Scenarios...")
        
        title = book_content.get("title", "Learning Scenario")
        modules = book_content.get("modules", [])
        key_concepts = book_content.get("key_concepts", [])
        learning_objectives = book_content.get("learning_objectives", [])
        
        scenarios = []
        
        # Generate different types of scenarios based on content
        if scenario_type == "case_study" or scenario_type == "all":
            scenarios.append(self._generate_case_scenario(
                title, modules, key_concepts, learning_objectives))
        
        if scenario_type == "decision_tree" or scenario_type == "all":
            scenarios.append(self._generate_decision_scenario(
                title, modules, key_concepts))
        
        if scenario_type == "role_play" or scenario_type == "all":
            scenarios.append(self._generate_roleplay_scenario(
                title, book_content))
        
        if scenario_type == "simulation" or scenario_type == "all":
            scenarios.append(self._generate_simulation_scenario(
                title, modules, key_concepts))
        
        # Default to case study if no scenarios generated
        if not scenarios:
            scenarios.append(self._generate_case_scenario(
                title, modules, key_concepts, learning_objectives))
        
        return {
            "scenarios": [asdict(s) for s in scenarios],
            "total_scenarios": len(scenarios),
            "estimated_total_time": self._calculate_total_time(scenarios),
            "difficulty_distribution": self._analyze_difficulty(scenarios),
            "skills_matrix": self._generate_skills_matrix(scenarios),
            "integration_guide": self._generate_integration_guide(),
            "export_formats": ["json", "scorm", "xapi"]
        }
    
    def _generate_case_scenario(self, title: str, modules: List[Dict],
                                key_concepts: List[str],
                                learning_objectives: List[str]) -> LearningScenario:
        """Generate a case study scenario"""
        scenario_id = str(uuid.uuid4())[:8]
        
        if self.language == "id":
            scenario_title = f"Studi Kasus: {title}"
            description = f"Analisis kasus nyata terkait {title}. Buat keputusan yang tepat berdasarkan konsep yang dipelajari."
        else:
            scenario_title = f"Case Study: {title}"
            description = f"Analyze a real-world case related to {title}. Make appropriate decisions based on learned concepts."
        
        # Create nodes
        nodes = []
        
        # Start node - situation
        start_node = ScenarioNode(
            id="start",
            type="situation",
            title=f"Situasi Awal" if self.language == "id" else "Initial Situation",
            description=self._create_situation_description(title, modules[0] if modules else None),
            choices=[],
            learning_objectives=learning_objectives[:3] if learning_objectives else []
        )
        
        # Decision nodes based on modules
        for i, module in enumerate(modules[:3] if modules else [{}]):
            node_id = f"decision_{i+1}"
            module_title = module.get("title", f"Step {i+1}")
            
            if self.language == "id":
                title_text = f"Keputusan: {module_title}"
                desc = f"Anda menghadapi situasi terkait {module_title}. Apa yang akan Anda lakukan?"
            else:
                title_text = f"Decision: {module_title}"
                desc = f"You face a situation regarding {module_title}. What will you do?"
            
            choices = self._generate_choices_for_node(module, key_concepts)
            
            decision_node = ScenarioNode(
                id=node_id,
                type="decision",
                title=title_text,
                description=desc,
                choices=choices,
                learning_objectives=[module.get("title", "")]
            )
            nodes.append(decision_node)
        
        # Outcome nodes
        for i in range(3):  # Best, good, poor outcomes
            outcome_types = ["best", "good", "poor"]
            outcome_names_id = ["Hasil Optimal", "Hasil Baik", "Hasil Perlu Perbaikan"]
            outcome_names_en = ["Optimal Outcome", "Good Outcome", "Needs Improvement"]
            
            node_id = f"outcome_{outcome_types[i]}"
            
            if self.language == "id":
                title_text = outcome_names_id[i]
                descriptions = [
                    "Keputusan Anda sangat tepat! Anda berhasil menerapkan semua konsep dengan baik.",
                    "Keputusan Anda baik tetapi masih ada ruang untuk perbaikan.",
                    "Keputusan Anda perlu dievaluasi ulang. Pelajari konsep lebih dalam."
                ]
            else:
                title_text = outcome_names_en[i]
                descriptions = [
                    "Excellent decision! You successfully applied all concepts.",
                    "Good decision, but there's room for improvement.",
                    "Your decision needs reevaluation. Study the concepts more deeply."
                ]
            
            outcome_node = ScenarioNode(
                id=node_id,
                type="outcome",
                title=title_text,
                description=descriptions[i],
                is_endpoint=True,
                learning_objectives=[]
            )
            nodes.append(outcome_node)
        
        # Reflection node
        if self.language == "id":
            reflection_desc = "Refleksikan pengalaman Anda. Apa yang bisa dipelajari dari skenario ini?"
        else:
            reflection_desc = "Reflect on your experience. What can be learned from this scenario?"
        
        reflection_node = ScenarioNode(
            id="reflection",
            type="reflection",
            title="Refleksi" if self.language == "id" else "Reflection",
            description=reflection_desc,
            is_endpoint=True,
            learning_objectives=learning_objectives
        )
        nodes.append(reflection_node)
        
        return LearningScenario(
            id=f"case_{scenario_id}",
            title=scenario_title,
            description=description,
            type="case_study",
            difficulty="intermediate",
            estimated_time="15-20 menit" if self.language == "id" else "15-20 minutes",
            start_node_id="start",
            nodes=nodes,
            learning_outcomes=learning_objectives[:4] if learning_objectives else [],
            badges_unlocked=["case_analyst", "decision_maker"]
        )
    
    def _generate_decision_scenario(self, title: str, modules: List[Dict],
                                    key_concepts: List[str]) -> LearningScenario:
        """Generate a branching decision tree scenario"""
        scenario_id = str(uuid.uuid4())[:8]
        
        if self.language == "id":
            scenario_title = f"Pohon Keputusan: {title}"
            description = f"Navigasi serangkaian keputusan yang saling terkait dalam konteks {title}."
        else:
            scenario_title = f"Decision Tree: {title}"
            description = f"Navigate a series of interconnected decisions in the context of {title}."
        
        nodes = []
        
        # Create branching tree with 3 levels
        # Level 1: Initial decision
        nodes.append(ScenarioNode(
            id="decision_1",
            type="decision",
            title="Keputusan 1" if self.language == "id" else "Decision 1",
            description="Pilihan pertama Anda menentukan arah selanjutnya." if self.language == "id" else "Your first choice determines the path forward.",
            choices=[
                ScenarioChoice("c1a", "Opsi A", "Mengarah ke jalur analitis", "decision_2a", 
                             "Pendekatan analitis dipilih", 10, ["analysis"]),
                ScenarioChoice("c1b", "Opsi B", "Mengarah ke jalur kreatif", "decision_2b",
                             "Pendekatan kreatif dipilih", 10, ["creativity"]),
                ScenarioChoice("c1c", "Opsi C", "Mengarah ke jalur praktis", "decision_2c",
                             "Pendekatan praktis dipilih", 10, ["practicality"])
            ]
        ))
        
        # Level 2: Secondary decisions
        for path in ["a", "b", "c"]:
            concept = key_concepts.pop(0) if key_concepts else f"Konsep {path.upper()}"
            nodes.append(ScenarioNode(
                id=f"decision_2{path}",
                type="decision",
                title=f"Keputusan 2 ({path.upper()})",
                description=f"Berdasarkan pilihan sebelumnya, sekarang terkait {concept}.",
                choices=self._generate_path_choices(path, concept)
            ))
        
        # Level 3: Final outcomes
        for path in ["aa", "ab", "ba", "bb", "ca", "cb"]:
            nodes.append(ScenarioNode(
                id=f"outcome_{path}",
                type="outcome",
                title=f"Hasil {path.upper()}",
                description=f"Hasil akhir dari jalur keputusan {path.upper()}",
                is_endpoint=True
            ))
        
        return LearningScenario(
            id=f"decision_{scenario_id}",
            title=scenario_title,
            description=description,
            type="decision_tree",
            difficulty="advanced",
            estimated_time="20-25 menit" if self.language == "id" else "20-25 minutes",
            start_node_id="decision_1",
            nodes=nodes,
            learning_outcomes=["Decision making", "Critical thinking", "Consequence analysis"],
            badges_unlocked=["decision_master", "strategic_thinker"]
        )
    
    def _generate_roleplay_scenario(self, title: str, book_content: Dict) -> LearningScenario:
        """Generate a role-play scenario"""
        scenario_id = str(uuid.uuid4())[:8]
        
        if self.language == "id":
            scenario_title = f"Role-Play: {title}"
            description = f"Perankan peran dalam situasi nyata terkait {title}."
        else:
            scenario_title = f"Role-Play: {title}"
            description = f"Assume a role in a real-world situation related to {title}."
        
        roles = [
            {"id": "manager", "name": "Manajer" if self.language == "id" else "Manager", 
             "description": "Anda membuat keputusan strategis." if self.language == "id" else "You make strategic decisions."},
            {"id": "analyst", "name": "Analis" if self.language == "id" else "Analyst",
             "description": "Anda menganalisis data dan situasi." if self.language == "id" else "You analyze data and situations."},
            {"id": "implementer", "name": "Implementor" if self.language == "id" else "Implementer",
             "description": "Anda mengeksekusi rencana." if self.language == "id" else "You execute plans."}
        ]
        
        nodes = []
        
        # Role selection
        nodes.append(ScenarioNode(
            id="role_select",
            type="situation",
            title="Pilih Peran" if self.language == "id" else "Select Role",
            description="Pilih peran yang ingin Anda mainkan dalam skenario ini.",
            choices=[
                ScenarioChoice(f"role_{r['id']}", r["name"], r["description"], f"role_{r['id']}_start")
                for r in roles
            ]
        ))
        
        # Role-specific scenarios
        for role in roles:
            nodes.append(ScenarioNode(
                id=f"role_{role['id']}_start",
                type="situation",
                title=f"Skenario: {role['name']}",
                description=f"Sebagai {role['name']}, Anda menghadapi situasi berikut...",
                choices=[
                    ScenarioChoice(f"{role['id']}_1", "Tindakan A", "Respons A", f"{role['id']}_outcome"),
                    ScenarioChoice(f"{role['id']}_2", "Tindakan B", "Respons B", f"{role['id']}_outcome")
                ]
            ))
            
            nodes.append(ScenarioNode(
                id=f"{role['id']}_outcome",
                type="outcome",
                title=f"Hasil: {role['name']}",
                description=f"Skenario selesai untuk peran {role['name']}",
                is_endpoint=True
            ))
        
        return LearningScenario(
            id=f"roleplay_{scenario_id}",
            title=scenario_title,
            description=description,
            type="role_play",
            difficulty="intermediate",
            estimated_time="25-30 menit" if self.language == "id" else "25-30 minutes",
            start_node_id="role_select",
            nodes=nodes,
            learning_outcomes=["Role understanding", "Perspective taking", "Communication"],
            badges_unlocked=["role_player", "empathy_builder"]
        )
    
    def _generate_simulation_scenario(self, title: str, modules: List[Dict],
                                      key_concepts: List[str]) -> LearningScenario:
        """Generate an interactive simulation scenario"""
        scenario_id = str(uuid.uuid4())[:8]
        
        if self.language == "id":
            scenario_title = f"Simulasi: {title}"
            description = f"Simulasi interaktif untuk mempraktikkan konsep {title}."
        else:
            scenario_title = f"Simulation: {title}"
            description = f"Interactive simulation to practice {title} concepts."
        
        nodes = []
        
        # Simulation parameters
        nodes.append(ScenarioNode(
            id="sim_setup",
            type="situation",
            title="Pengaturan Simulasi" if self.language == "id" else "Simulation Setup",
            description="Atur parameter simulasi Anda.",
            choices=[
                ScenarioChoice("easy", "Mudah", "Level pemula", "sim_run"),
                ScenarioChoice("medium", "Sedang", "Level menengah", "sim_run"),
                ScenarioChoice("hard", "Sulit", "Level ahli", "sim_run")
            ]
        ))
        
        # Simulation run with variables
        nodes.append(ScenarioNode(
            id="sim_run",
            type="decision",
            title="Jalankan Simulasi",
            description="Simulasi sedang berjalan. Buat keputusan real-time.",
            choices=[
                ScenarioChoice("adapt", "Adaptasi", "Sesuaikan strategi", "sim_result"),
                ScenarioChoice("continue", "Lanjutkan", "Pertahankan pendekatan", "sim_result"),
                ScenarioChoice("reset", "Ulang", "Mulai ulang dengan pendekatan baru", "sim_setup")
            ]
        ))
        
        # Results
        nodes.append(ScenarioNode(
            id="sim_result",
            type="outcome",
            title="Hasil Simulasi",
            description="Simulasi selesai. Lihat metrik performa Anda.",
            is_endpoint=True
        ))
        
        return LearningScenario(
            id=f"sim_{scenario_id}",
            title=scenario_title,
            description=description,
            type="simulation",
            difficulty="advanced",
            estimated_time="30-40 menit" if self.language == "id" else "30-40 minutes",
            start_node_id="sim_setup",
            nodes=nodes,
            learning_outcomes=["Hands-on practice", "Real-time decision making", "Adaptation"],
            badges_unlocked=["simulation_master", "practitioner"]
        )
    
    def _generate_choices_for_node(self, module: Dict, key_concepts: List[str]) -> List[ScenarioChoice]:
        """Generate choices for a decision node"""
        choices = []
        
        concept = key_concepts.pop(0) if key_concepts else "konsep"
        
        if self.language == "id":
            choice_texts = [
                (f"Terapkan {concept} secara langsung", "Direct application", 15),
                (f"Analisis situasi terlebih dahulu", "Analyze then act", 20),
                (f"Konsultasi dengan tim", "Team consultation", 10)
            ]
        else:
            choice_texts = [
                (f"Apply {concept} directly", "Direct application", 15),
                (f"Analyze situation first", "Analyze then act", 20),
                (f"Consult with team", "Team consultation", 10)
            ]
        
        for i, (text, consequence, points) in enumerate(choice_texts):
            choices.append(ScenarioChoice(
                id=f"choice_{i}",
                text=text,
                consequence=consequence,
                next_node_id=f"outcome_{['best', 'good', 'poor'][i]}",
                feedback="Pilihan yang tepat!" if self.language == "id" else "Great choice!",
                points=points,
                skills_tested=["analysis", "decision_making"]
            ))
        
        return choices
    
    def _generate_path_choices(self, path: str, concept: str) -> List[ScenarioChoice]:
        """Generate choices for a specific path"""
        outcomes = [f"outcome_{path}a", f"outcome_{path}b"]
        
        if self.language == "id":
            return [
                ScenarioChoice(f"{path}_a", f"Opsi {path.upper()}A", f"Terkait {concept}", outcomes[0]),
                ScenarioChoice(f"{path}_b", f"Opsi {path.upper()}B", f"Alternatif untuk {concept}", outcomes[1])
            ]
        else:
            return [
                ScenarioChoice(f"{path}_a", f"Option {path.upper()}A", f"Related to {concept}", outcomes[0]),
                ScenarioChoice(f"{path}_b", f"Option {path.upper()}B", f"Alternative for {concept}", outcomes[1])
            ]
    
    def _create_situation_description(self, title: str, module: Optional[Dict]) -> str:
        """Create a situation description"""
        module_desc = module.get("description", "") if module else ""
        
        if self.language == "id":
            return f"Anda sedang menghadapi situasi dalam konteks {title}. {module_desc}"
        else:
            return f"You are facing a situation in the context of {title}. {module_desc}"
    
    def _calculate_total_time(self, scenarios: List[LearningScenario]) -> str:
        """Calculate total estimated time"""
        total_minutes = 0
        for scenario in scenarios:
            time_str = scenario.estimated_time
            # Extract minutes from strings like "15-20 minutes"
            try:
                max_time = int(time_str.split('-')[1].split()[0])
                total_minutes += max_time
            except:
                total_minutes += 20  # Default
        
        return f"{total_minutes} menit" if self.language == "id" else f"{total_minutes} minutes"
    
    def _analyze_difficulty(self, scenarios: List[LearningScenario]) -> Dict[str, int]:
        """Analyze difficulty distribution"""
        distribution = {"beginner": 0, "intermediate": 0, "advanced": 0, "expert": 0}
        for scenario in scenarios:
            if scenario.difficulty in distribution:
                distribution[scenario.difficulty] += 1
        return distribution
    
    def _generate_skills_matrix(self, scenarios: List[LearningScenario]) -> Dict[str, List[str]]:
        """Generate skills matrix for all scenarios"""
        skills = {}
        for scenario in scenarios:
            skills[scenario.title] = scenario.learning_outcomes
        return skills
    
    def _generate_integration_guide(self) -> Dict[str, Any]:
        """Generate guide for integrating scenarios into LMS"""
        return {
            "lms_compatibility": ["Moodle", "Canvas", "Blackboard", "Google Classroom"],
            "xapi_statements": True,
            "tracking_metrics": ["completion", "score", "time_spent", "decision_path", "retry_count"],
            "embedding_options": {
                "iframe": "<iframe src='...'></iframe>",
                "lti": "LTI 1.3 compatible",
                "scorm": "SCORM 1.2 / 2004"
            },
            "analytics_dashboard": {
                "learner_progress": "Track individual paths",
                "common_mistakes": "Identify frequent wrong choices",
                "engagement_metrics": "Time spent, retry patterns"
            }
        }


# Adapter function for pipeline
def generate_interactive_scenarios(book_content: Dict[str, Any],
                                   scenario_type: str = "all",
                                   language: str = "id") -> Dict[str, Any]:
    """
    Adapter function for pipeline integration
    
    Args:
        book_content: Book content dictionary
        scenario_type: Type of scenario ('case_study', 'decision_tree', 'role_play', 'simulation', 'all')
        language: Language code ('id' or 'en')
        
    Returns:
        Dictionary with interactive scenarios data
    """
    generator = InteractiveScenarioGenerator(language=language)
    return generator.generate_scenarios(book_content, scenario_type)


if __name__ == "__main__":
    # Test
    test_content = {
        "title": "Project Management Basics",
        "modules": [
            {"title": "Project Initiation", "description": "Starting a new project", "content": "Define scope and objectives"},
            {"title": "Planning Phase", "description": "Creating project plans", "content": "Develop schedule and allocate resources"},
            {"title": "Execution", "description": "Implementing the plan", "content": "Monitor progress and manage team"}
        ],
        "key_concepts": ["Scope", "Schedule", "Resources", "Risk", "Stakeholders"],
        "learning_objectives": ["Plan projects effectively", "Manage resources", "Handle risks"]
    }
    
    result = generate_interactive_scenarios(test_content, scenario_type="all", language="en")
    print(f"Generated {result['total_scenarios']} scenarios")
    print(f"Total time: {result['estimated_total_time']}")