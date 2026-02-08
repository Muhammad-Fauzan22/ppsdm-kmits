"""
AI Provider Abstraction - Infinite Learning Factory
====================================================
Unified interface for multiple AI providers with automatic failover.
Eliminates single point of failure on any one provider.

Supported Providers (all FREE tier):
1. Google Gemini 1.5 Flash (Primary) - 15 RPM
2. Hugging Face Inference API - 30K tokens/day
3. Groq (Llama 3) - 14.4K tokens/min
4. Local Ollama (Optional) - Unlimited
"""

import os
import json
import logging
import time
from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional, List, Dict, Any, Callable
from dataclasses import dataclass

# Import our utilities
try:
    from utils.rate_limiter import rate_limiter
    from utils.retry_handler import retry, RetryConfig, with_circuit_breaker
    from utils.monitoring import error_monitor
except ImportError:
    # Fallback stubs
    class DummyRateLimiter:
        def wait(self, provider): pass
    rate_limiter = DummyRateLimiter()
    def retry(*args, **kwargs):
        def decorator(func): return func
        return decorator
    def with_circuit_breaker(*args, **kwargs):
        def decorator(func): return func
        return decorator

# Provider SDKs
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

try:
    from huggingface_hub import InferenceClient
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

try:
    import requests
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIProvider(Enum):
    """Available AI providers."""
    GEMINI = "gemini"
    HUGGINGFACE = "huggingface"
    GROQ = "groq"
    OLLAMA = "ollama"


@dataclass
class AIResponse:
    """Standardized AI response format."""
    text: str
    provider: AIProvider
    model: str
    tokens_used: Optional[int] = None
    latency_ms: Optional[float] = None
    raw_response: Optional[Any] = None
    success: bool = True
    error: Optional[str] = None


@dataclass
class ProviderConfig:
    """Configuration for an AI provider."""
    provider: AIProvider
    model: str
    api_key: Optional[str] = None
    endpoint: Optional[str] = None
    max_tokens: int = 8192
    temperature: float = 0.7
    priority: int = 0  # Lower = higher priority
    enabled: bool = True


class BaseProvider(ABC):
    """Abstract base class for AI providers."""
    
    def __init__(self, config: ProviderConfig):
        self.config = config
        self.call_count = 0
        self.error_count = 0
        self.total_latency = 0.0
    
    @abstractmethod
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> AIResponse:
        """Generate text from prompt."""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider is available."""
        pass
    
    def get_stats(self) -> Dict:
        """Get provider statistics."""
        return {
            'provider': self.config.provider.value,
            'model': self.config.model,
            'call_count': self.call_count,
            'error_count': self.error_count,
            'avg_latency_ms': self.total_latency / max(1, self.call_count),
            'success_rate': (self.call_count - self.error_count) / max(1, self.call_count)
        }


class GeminiProvider(BaseProvider):
    """Google Gemini provider."""
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        if GEMINI_AVAILABLE and config.api_key:
            genai.configure(api_key=config.api_key)
            self.model = genai.GenerativeModel(config.model)
        else:
            self.model = None
    
    def is_available(self) -> bool:
        return GEMINI_AVAILABLE and self.model is not None
    
    @retry(config=RetryConfig(max_retries=2, initial_delay=2.0))
    @with_circuit_breaker('gemini')
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> AIResponse:
        rate_limiter.wait('gemini')
        
        start_time = time.time()
        self.call_count += 1
        
        try:
            full_prompt = prompt
            if system_prompt:
                full_prompt = f"{system_prompt}\n\n{prompt}"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=self.config.max_tokens,
                    temperature=self.config.temperature,
                )
            )
            
            latency = (time.time() - start_time) * 1000
            self.total_latency += latency
            
            return AIResponse(
                text=response.text,
                provider=AIProvider.GEMINI,
                model=self.config.model,
                latency_ms=latency,
                raw_response=response
            )
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"Gemini error: {e}")
            return AIResponse(
                text="",
                provider=AIProvider.GEMINI,
                model=self.config.model,
                success=False,
                error=str(e)
            )


class HuggingFaceProvider(BaseProvider):
    """Hugging Face Inference API provider."""
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        if HF_AVAILABLE and config.api_key:
            self.client = InferenceClient(token=config.api_key)
        else:
            self.client = None
    
    def is_available(self) -> bool:
        return HF_AVAILABLE and self.client is not None
    
    @retry(config=RetryConfig(max_retries=2, initial_delay=2.0))
    @with_circuit_breaker('huggingface')
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> AIResponse:
        rate_limiter.wait('huggingface')
        
        start_time = time.time()
        self.call_count += 1
        
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = self.client.chat_completion(
                model=self.config.model,
                messages=messages,
                max_tokens=self.config.max_tokens,
                temperature=self.config.temperature,
            )
            
            latency = (time.time() - start_time) * 1000
            self.total_latency += latency
            
            text = response.choices[0].message.content
            
            return AIResponse(
                text=text,
                provider=AIProvider.HUGGINGFACE,
                model=self.config.model,
                tokens_used=response.usage.total_tokens if hasattr(response, 'usage') else None,
                latency_ms=latency,
                raw_response=response
            )
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"HuggingFace error: {e}")
            return AIResponse(
                text="",
                provider=AIProvider.HUGGINGFACE,
                model=self.config.model,
                success=False,
                error=str(e)
            )


class GroqProvider(BaseProvider):
    """Groq (Llama 3) provider."""
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        if GROQ_AVAILABLE and config.api_key:
            self.client = Groq(api_key=config.api_key)
        else:
            self.client = None
    
    def is_available(self) -> bool:
        return GROQ_AVAILABLE and self.client is not None
    
    @retry(config=RetryConfig(max_retries=2, initial_delay=1.0))
    @with_circuit_breaker('groq')
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> AIResponse:
        rate_limiter.wait('groq')
        
        start_time = time.time()
        self.call_count += 1
        
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = self.client.chat.completions.create(
                model=self.config.model,
                messages=messages,
                max_tokens=self.config.max_tokens,
                temperature=self.config.temperature,
            )
            
            latency = (time.time() - start_time) * 1000
            self.total_latency += latency
            
            text = response.choices[0].message.content
            
            return AIResponse(
                text=text,
                provider=AIProvider.GROQ,
                model=self.config.model,
                tokens_used=response.usage.total_tokens if hasattr(response, 'usage') else None,
                latency_ms=latency,
                raw_response=response
            )
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"Groq error: {e}")
            return AIResponse(
                text="",
                provider=AIProvider.GROQ,
                model=self.config.model,
                success=False,
                error=str(e)
            )


class OllamaProvider(BaseProvider):
    """Local Ollama provider."""
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self.endpoint = config.endpoint or "http://localhost:11434"
    
    def is_available(self) -> bool:
        if not OLLAMA_AVAILABLE:
            return False
        try:
            response = requests.get(f"{self.endpoint}/api/tags", timeout=2)
            return response.status_code == 200
        except:
            return False
    
    @retry(config=RetryConfig(max_retries=2, initial_delay=1.0))
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> AIResponse:
        start_time = time.time()
        self.call_count += 1
        
        try:
            payload = {
                "model": self.config.model,
                "prompt": prompt,
                "system": system_prompt or "",
                "stream": False,
                "options": {
                    "temperature": self.config.temperature,
                    "num_predict": self.config.max_tokens,
                }
            }
            
            response = requests.post(
                f"{self.endpoint}/api/generate",
                json=payload,
                timeout=120
            )
            response.raise_for_status()
            
            latency = (time.time() - start_time) * 1000
            self.total_latency += latency
            
            result = response.json()
            
            return AIResponse(
                text=result.get('response', ''),
                provider=AIProvider.OLLAMA,
                model=self.config.model,
                latency_ms=latency,
                raw_response=result
            )
            
        except Exception as e:
            self.error_count += 1
            logger.error(f"Ollama error: {e}")
            return AIResponse(
                text="",
                provider=AIProvider.OLLAMA,
                model=self.config.model,
                success=False,
                error=str(e)
            )


class AIProviderManager:
    """
    Manager for AI providers with automatic failover.
    
    Usage:
        manager = AIProviderManager()
        response = manager.generate("Write a poem about cats")
        print(response.text)
    """
    
    def __init__(self):
        self.providers: List[BaseProvider] = []
        self._init_providers()
    
    def _init_providers(self) -> None:
        """Initialize all available providers in priority order."""
        
        # 1. Gemini (Primary - FREE)
        gemini_key = os.environ.get('GEMINI_API_KEY')
        if gemini_key and GEMINI_AVAILABLE:
            config = ProviderConfig(
                provider=AIProvider.GEMINI,
                model="gemini-1.5-flash",
                api_key=gemini_key,
                max_tokens=8192,
                temperature=0.7,
                priority=0
            )
            provider = GeminiProvider(config)
            if provider.is_available():
                self.providers.append(provider)
                logger.info("✅ Gemini provider initialized")
        
        # 2. Groq (Fallback 1 - FREE, very fast)
        groq_key = os.environ.get('GROQ_API_KEY')
        if groq_key and GROQ_AVAILABLE:
            config = ProviderConfig(
                provider=AIProvider.GROQ,
                model="llama-3.1-70b-versatile",
                api_key=groq_key,
                max_tokens=8192,
                temperature=0.7,
                priority=1
            )
            provider = GroqProvider(config)
            if provider.is_available():
                self.providers.append(provider)
                logger.info("✅ Groq provider initialized")
        
        # 3. Hugging Face (Fallback 2 - FREE)
        hf_key = os.environ.get('HUGGINGFACE_API_KEY') or os.environ.get('HF_TOKEN')
        if hf_key and HF_AVAILABLE:
            config = ProviderConfig(
                provider=AIProvider.HUGGINGFACE,
                model="meta-llama/Meta-Llama-3.1-70B-Instruct",
                api_key=hf_key,
                max_tokens=4096,
                temperature=0.7,
                priority=2
            )
            provider = HuggingFaceProvider(config)
            if provider.is_available():
                self.providers.append(provider)
                logger.info("✅ HuggingFace provider initialized")
        
        # 4. Ollama (Local fallback - FREE, unlimited)
        ollama_endpoint = os.environ.get('OLLAMA_ENDPOINT', 'http://localhost:11434')
        ollama_model = os.environ.get('OLLAMA_MODEL', 'llama3')
        config = ProviderConfig(
            provider=AIProvider.OLLAMA,
            model=ollama_model,
            endpoint=ollama_endpoint,
            max_tokens=4096,
            temperature=0.7,
            priority=3
        )
        provider = OllamaProvider(config)
        if provider.is_available():
            self.providers.append(provider)
            logger.info("✅ Ollama provider initialized (local)")
        
        # Sort by priority
        self.providers.sort(key=lambda p: p.config.priority)
        
        if not self.providers:
            logger.warning("⚠️ No AI providers available!")
        else:
            logger.info(f"Initialized {len(self.providers)} AI provider(s)")
    
    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        preferred_provider: Optional[AIProvider] = None
    ) -> AIResponse:
        """
        Generate text with automatic failover.
        
        Tries providers in priority order until one succeeds.
        """
        if not self.providers:
            return AIResponse(
                text="",
                provider=AIProvider.GEMINI,
                model="none",
                success=False,
                error="No AI providers available"
            )
        
        # Reorder if preferred provider specified
        providers = list(self.providers)
        if preferred_provider:
            providers.sort(key=lambda p: 0 if p.config.provider == preferred_provider else 1)
        
        errors = []
        for provider in providers:
            logger.debug(f"Trying {provider.config.provider.value}...")
            
            response = provider.generate(prompt, system_prompt)
            
            if response.success and response.text:
                return response
            
            errors.append(f"{provider.config.provider.value}: {response.error}")
        
        # All providers failed
        return AIResponse(
            text="",
            provider=AIProvider.GEMINI,
            model="none",
            success=False,
            error=f"All providers failed: {'; '.join(errors)}"
        )
    
    def generate_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
    ) -> Optional[Dict]:
        """Generate and parse JSON response."""
        json_system = (system_prompt or "") + "\n\nRespond ONLY with valid JSON. No markdown, no explanation."
        
        response = self.generate(prompt, json_system)
        
        if not response.success:
            return None
        
        try:
            # Clean response
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            return json.loads(text.strip())
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            return None
    
    def get_stats(self) -> Dict:
        """Get statistics for all providers."""
        return {
            'providers': [p.get_stats() for p in self.providers],
            'total_providers': len(self.providers),
            'available_providers': [p.config.provider.value for p in self.providers]
        }


# Global instance
ai_provider = AIProviderManager()


def generate(prompt: str, system_prompt: Optional[str] = None) -> str:
    """Convenience function for text generation."""
    response = ai_provider.generate(prompt, system_prompt)
    return response.text if response.success else ""


def generate_json(prompt: str, system_prompt: Optional[str] = None) -> Optional[Dict]:
    """Convenience function for JSON generation."""
    return ai_provider.generate_json(prompt, system_prompt)


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv('.env.local')
    
    print("Testing AI Provider Manager...")
    print("=" * 60)
    
    manager = AIProviderManager()
    print("\nProvider stats:", json.dumps(manager.get_stats(), indent=2))
    
    print("\nTesting generation...")
    response = manager.generate(
        "Say 'Hello from AI Provider!' in Indonesian",
        "You are a helpful assistant."
    )
    
    print(f"\nProvider: {response.provider.value}")
    print(f"Model: {response.model}")
    print(f"Latency: {response.latency_ms:.2f}ms")
    print(f"Response: {response.text}")
