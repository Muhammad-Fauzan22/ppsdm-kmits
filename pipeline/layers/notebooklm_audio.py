"""
Layer 9: NotebookLM-Style Audio Generation
Generate podcast-style audio with multiple voices/dialogue
Supports Indonesian and English output
"""

from typing import Dict, Any, List
import json
from dataclasses import dataclass, asdict
from enum import Enum


class VoiceRole(Enum):
    HOST = "host"
    EXPERT = "expert"
    STUDENT = "student"
    NARRATOR = "narrator"


@dataclass
class DialogueSegment:
    """Represents a segment of dialogue"""
    speaker: str
    role: str
    text: str
    emotion: str = "neutral"
    pause_after: float = 0.5  # seconds


@dataclass
class PodcastEpisode:
    """Represents a complete podcast episode"""
    title: str
    description: str
    duration_estimate: str
    segments: List[DialogueSegment]
    intro_music: bool = True
    outro_music: bool = True
    sound_effects: List[str] = None


class NotebookLMAudioGenerator:
    """
    Generate podcast-style audio content from learning materials
    Mimics Google NotebookLM's audio generation capability
    """
    
    VOICES = {
        "id": {
            "host": {"name": "Andi", "gender": "male", "style": "professional"},
            "expert": {"name": "Dr. Sari", "gender": "female", "style": "academic"},
            "student": {"name": "Budi", "gender": "male", "style": "casual"},
            "narrator": {"name": "Nadia", "gender": "female", "style": "neutral"}
        },
        "en": {
            "host": {"name": "Alex", "gender": "male", "style": "professional"},
            "expert": {"name": "Dr. Sarah", "gender": "female", "style": "academic"},
            "student": {"name": "Jamie", "gender": "neutral", "style": "casual"},
            "narrator": {"name": "Morgan", "gender": "female", "style": "neutral"}
        }
    }
    
    def __init__(self, language: str = "id"):
        self.language = language
        self.voices = self.VOICES.get(language, self.VOICES["id"])
        
    def generate_podcast(self, book_content: Dict[str, Any], 
                        style: str = "educational_interview") -> Dict[str, Any]:
        """
        Generate podcast episode from book content
        
        Args:
            book_content: Dictionary containing book data
            style: Podcast style - educational_interview, discussion, lecture, storytelling
            
        Returns:
            Dictionary with podcast script and metadata
        """
        print(f"   [Layer 9] Generating NotebookLM-Style Audio...")
        
        title = book_content.get("title", "Learning Podcast")
        modules = book_content.get("modules", [])
        key_concepts = book_content.get("key_concepts", [])
        learning_objectives = book_content.get("learning_objectives", [])
        
        # Generate podcast based on style
        if style == "educational_interview":
            podcast = self._generate_interview_format(title, modules, key_concepts, learning_objectives)
        elif style == "discussion":
            podcast = self._generate_discussion_format(title, modules, key_concepts)
        elif style == "storytelling":
            podcast = self._generate_storytelling_format(title, book_content)
        else:
            podcast = self._generate_lecture_format(title, modules, key_concepts)
        
        return {
            "title": podcast.title,
            "description": podcast.description,
            "duration_estimate": podcast.duration_estimate,
            "style": style,
            "language": self.language,
            "voices_used": self.voices,
            "script": [asdict(segment) for segment in podcast.segments],
            "audio_segments": self._estimate_audio_segments(podcast.segments),
            "production_notes": self._generate_production_notes(podcast),
            "tts_prompts": self._generate_tts_prompts(podcast.segments)
        }
    
    def _generate_interview_format(self, title: str, modules: List[Dict], 
                                   key_concepts: List[str],
                                   learning_objectives: List[str]) -> PodcastEpisode:
        """Generate interview-style podcast"""
        segments = []
        host = self.voices["host"]["name"]
        expert = self.voices["expert"]["name"]
        
        # Intro
        if self.language == "id":
            segments.extend([
                DialogueSegment(host, "host", 
                    f"Selamat datang di Podcast Pembelajaran. Saya {host}, dan hari ini kita akan membahas {title}.",
                    "enthusiastic", 1.0),
                DialogueSegment(expert, "expert",
                    f"Terima kasih {host}. Saya sangat senang bisa berbagi pengetahuan tentang topik ini.",
                    "warm", 0.5)
            ])
        else:
            segments.extend([
                DialogueSegment(host, "host",
                    f"Welcome to the Learning Podcast. I'm {host}, and today we'll explore {title}.",
                    "enthusiastic", 1.0),
                DialogueSegment(expert, "expert",
                    f"Thank you {host}. I'm excited to share insights about this fascinating topic.",
                    "warm", 0.5)
            ])
        
        # Content segments based on modules
        for module in modules[:3]:  # Limit to 3 modules for podcast length
            module_title = module.get("title", "")
            module_content = module.get("content", "")[:500]  # Limit content
            
            # Host asks question
            if self.language == "id":
                question = f"Bolehkah Anda menjelaskan tentang {module_title}?"
            else:
                question = f"Could you explain what {module_title} is all about?"
            
            segments.append(DialogueSegment(host, "host", question, "curious", 0.5))
            
            # Expert responds
            response = self._create_expert_response(module_title, module_content)
            segments.append(DialogueSegment(expert, "expert", response, "authoritative", 1.0))
            
            # Key concept highlight
            if key_concepts:
                concept = key_concepts.pop(0) if key_concepts else None
                if concept:
                    if self.language == "id":
                        followup = f"Konsep {concept} sangat penting ya?"
                        answer = f"Benar sekali. {concept} adalah fondasi dari pemahaman ini."
                    else:
                        followup = f"The concept of {concept} is really crucial, isn't it?"
                        answer = f"Absolutely. {concept} is fundamental to understanding this topic."
                    
                    segments.append(DialogueSegment(host, "host", followup, "intrigued", 0.5))
                    segments.append(DialogueSegment(expert, "expert", answer, "emphatic", 0.5))
        
        # Closing
        if self.language == "id":
            segments.extend([
                DialogueSegment(host, "host",
                    "Terima kasih banyak atas wawasan yang sangat berharga hari ini.",
                    "grateful", 0.5),
                DialogueSegment(expert, "expert",
                    "Sama-sama. Semoga bermanfaat untuk pendengar semua.",
                    "warm", 0.5),
                DialogueSegment(host, "host",
                    "Sampai jumpa di episode berikutnya!",
                    "enthusiastic", 1.0)
            ])
        else:
            segments.extend([
                DialogueSegment(host, "host",
                    "Thank you so much for these valuable insights today.",
                    "grateful", 0.5),
                DialogueSegment(expert, "expert",
                    "You're welcome. I hope our listeners find this helpful.",
                    "warm", 0.5),
                DialogueSegment(host, "host",
                    "Join us next time for more exciting topics!",
                    "enthusiastic", 1.0)
            ])
        
        return PodcastEpisode(
            title=f"Deep Dive: {title}",
            description=f"An educational interview exploring {title}",
            duration_estimate="15-20 minutes",
            segments=segments,
            intro_music=True,
            outro_music=True,
            sound_effects=["intro_jingle", "transition_chime", "outro_jingle"]
        )
    
    def _generate_discussion_format(self, title: str, modules: List[Dict], 
                                    key_concepts: List[str]) -> PodcastEpisode:
        """Generate group discussion format"""
        segments = []
        host = self.voices["host"]["name"]
        expert = self.voices["expert"]["name"]
        student = self.voices["student"]["name"]
        
        # Multi-person discussion
        if self.language == "id":
            segments.extend([
                DialogueSegment(host, "host", f"Mari kita diskusikan {title}.", "welcoming", 0.5),
                DialogueSegment(student, "student", "Saya punya beberapa pertanyaan tentang ini.", "curious", 0.5),
                DialogueSegment(expert, "expert", "Silakan tanyakan apa saja.", "open", 0.5)
            ])
        else:
            segments.extend([
                DialogueSegment(host, "host", f"Let's discuss {title}.", "welcoming", 0.5),
                DialogueSegment(student, "student", "I have some questions about this.", "curious", 0.5),
                DialogueSegment(expert, "expert", "Feel free to ask anything.", "open", 0.5)
            ])
        
        # Add discussion points
        for concept in key_concepts[:4]:
            if self.language == "id":
                segments.extend([
                    DialogueSegment(student, "student", f"Apa itu {concept}?", "questioning", 0.5),
                    DialogueSegment(expert, "expert", f"{concept} adalah... [penjelasan detail]", "explaining", 0.5),
                    DialogueSegment(host, "host", "Menarik sekali!", "engaged", 0.5)
                ])
            else:
                segments.extend([
                    DialogueSegment(student, "student", f"What is {concept}?", "questioning", 0.5),
                    DialogueSegment(expert, "expert", f"{concept} refers to... [detailed explanation]", "explaining", 0.5),
                    DialogueSegment(host, "host", "That's fascinating!", "engaged", 0.5)
                ])
        
        return PodcastEpisode(
            title=f"Discussion: {title}",
            description=f"A collaborative discussion about {title}",
            duration_estimate="20-25 minutes",
            segments=segments
        )
    
    def _generate_storytelling_format(self, title: str, book_content: Dict) -> PodcastEpisode:
        """Generate narrative/storytelling format"""
        segments = []
        narrator = self.voices["narrator"]["name"]
        
        # Story-based learning
        if self.language == "id":
            intro = f"Dalam perjalanan pembelajaran kita hari ini, kita akan mengikuti kisah tentang {title}."
        else:
            intro = f"In today's learning journey, we'll follow a story about {title}."
        
        segments.append(DialogueSegment(narrator, "narrator", intro, "storytelling", 1.0))
        
        # Story segments based on content
        modules = book_content.get("modules", [])
        for i, module in enumerate(modules[:3]):
            module_title = module.get("title", f"Chapter {i+1}")
            if self.language == "id":
                story_text = f"Bab {i+1}: {module_title}. [Narasi kisah pembelajaran]"
            else:
                story_text = f"Chapter {i+1}: {module_title}. [Learning narrative]"
            
            segments.append(DialogueSegment(narrator, "narrator", story_text, "storytelling", 0.5))
        
        return PodcastEpisode(
            title=f"Story: {title}",
            description=f"A narrative exploration of {title}",
            duration_estimate="18-22 minutes",
            segments=segments
        )
    
    def _generate_lecture_format(self, title: str, modules: List[Dict], 
                                 key_concepts: List[str]) -> PodcastEpisode:
        """Generate lecture-style podcast"""
        segments = []
        expert = self.voices["expert"]["name"]
        
        # Lecture introduction
        if self.language == "id":
            intro = f"Selamat datang dalam kuliah tentang {title}."
        else:
            intro = f"Welcome to this lecture on {title}."
        
        segments.append(DialogueSegment(expert, "expert", intro, "academic", 0.5))
        
        # Lecture content
        for module in modules[:4]:
            module_title = module.get("title", "")
            content = module.get("content", "")[:400]
            
            segments.append(DialogueSegment(expert, "expert", 
                f"Mari kita bahas {module_title}. {content}", 
                "academic", 1.0))
        
        return PodcastEpisode(
            title=f"Lecture: {title}",
            description=f"An academic lecture on {title}",
            duration_estimate="25-30 minutes",
            segments=segments
        )
    
    def _create_expert_response(self, topic: str, content: str) -> str:
        """Create a natural expert response"""
        # Simplify and structure the content for audio
        if len(content) > 300:
            content = content[:300] + "..."
        
        if self.language == "id":
            return f"{topic} adalah topik yang sangat menarik. Secara singkat, {content}"
        else:
            return f"{topic} is a fascinating topic. In essence, {content}"
    
    def _estimate_audio_segments(self, segments: List[DialogueSegment]) -> List[Dict]:
        """Estimate audio file segments for production"""
        audio_segments = []
        current_time = 0.0
        
        for i, segment in enumerate(segments):
            # Estimate duration based on text length (avg speaking rate ~150 words/min)
            word_count = len(segment.text.split())
            duration = (word_count / 150) * 60 + segment.pause_after
            
            audio_segments.append({
                "segment_id": i + 1,
                "speaker": segment.speaker,
                "start_time": current_time,
                "end_time": current_time + duration,
                "duration_seconds": duration,
                "text_preview": segment.text[:50] + "..." if len(segment.text) > 50 else segment.text
            })
            
            current_time += duration
        
        return audio_segments
    
    def _generate_production_notes(self, podcast: PodcastEpisode) -> Dict[str, Any]:
        """Generate production notes for audio creation"""
        return {
            "format": "multi-voice dialogue",
            "recording_tips": [
                "Record each speaker separately for better audio quality",
                "Use consistent microphone distance for each speaker",
                "Add 0.5 second pause between segments for editing"
            ],
            "post_processing": [
                "Normalize audio levels across all speakers",
                "Add intro/outro music",
                "Apply noise reduction",
                "Add transition effects between segments"
            ],
            "tts_options": {
                "recommended_engines": ["ElevenLabs", "Coqui TTS", "Murf.ai"],
                "voice_settings": {
                    "host": {"speed": 1.0, "pitch": "neutral"},
                    "expert": {"speed": 0.95, "pitch": "slightly_lower"},
                    "student": {"speed": 1.05, "pitch": "slightly_higher"}
                }
            }
        }
    
    def _generate_tts_prompts(self, segments: List[DialogueSegment]) -> List[Dict]:
        """Generate TTS-ready prompts for each segment"""
        tts_prompts = []
        
        for segment in segments:
            voice_info = self.voices.get(segment.role, self.voices["narrator"])
            
            tts_prompts.append({
                "speaker": segment.speaker,
                "role": segment.role,
                "text": segment.text,
                "voice_settings": {
                    "name": voice_info["name"],
                    "gender": voice_info["gender"],
                    "style": voice_info["style"],
                    "emotion": segment.emotion
                },
                "ssml": self._generate_ssml(segment)
            })
        
        return tts_prompts
    
    def _generate_ssml(self, segment: DialogueSegment) -> str:
        """Generate SSML markup for TTS"""
        emotion_tags = {
            "enthusiastic": '<prosody rate="105%" pitch="+5%">',
            "warm": '<prosody rate="95%" pitch="-2%">',
            "authoritative": '<prosody rate="95%" pitch="-5%">',
            "curious": '<prosody rate="100%" pitch="+2%">',
            "storytelling": '<prosody rate="90%" pitch="var(±3%)">',
            "academic": '<prosody rate="92%" pitch="-3%">',
            "neutral": '<prosody rate="100%">'
        }
        
        open_tag = emotion_tags.get(segment.emotion, emotion_tags["neutral"])
        close_tag = '</prosody>'
        
        return f'<speak>{open_tag}{segment.text}{close_tag}<break time="{int(segment.pause_after*1000)}ms"/></speak>'


# Adapter function for pipeline
def generate_notebooklm_audio(book_content: Dict[str, Any],
                              style: str = "educational_interview",
                              language: str = "id") -> Dict[str, Any]:
    """
    Adapter function for pipeline integration
    
    Args:
        book_content: Book content dictionary
        style: Podcast style
        language: Language code ('id' or 'en')
        
    Returns:
        Dictionary with podcast script and metadata
    """
    generator = NotebookLMAudioGenerator(language=language)
    return generator.generate_podcast(book_content, style)


if __name__ == "__main__":
    # Test
    test_content = {
        "title": "Introduction to Machine Learning",
        "modules": [
            {"title": "What is ML?", "content": "Machine learning is a subset of AI that enables systems to learn from data."},
            {"title": "Types of ML", "content": "There are three main types: supervised, unsupervised, and reinforcement learning."}
        ],
        "key_concepts": ["Algorithm", "Training Data", "Model", "Prediction"],
        "learning_objectives": ["Understand ML basics", "Identify ML types", "Apply ML concepts"]
    }
    
    result = generate_notebooklm_audio(test_content, style="educational_interview", language="en")
    print(f"Generated podcast: {result['title']}")
    print(f"Duration: {result['duration_estimate']}")
    print(f"Segments: {len(result['script'])}")