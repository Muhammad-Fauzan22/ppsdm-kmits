#!/usr/bin/env python3
"""
Grade A AI Swarm - Multi-Provider AI Client
Implements intelligent routing across NVIDIA, OpenRouter, Puter AI, and Groq

Author: PPSDM KMM Content Factory
Version: 1.0.0
"""

import os
import json
import asyncio
import hashlib
import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from pathlib import Path
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProviderType(Enum):
    """Available AI providers"""
    NVIDIA = "nvidia"
    OPENROUTER = "openrouter"
    PUTER = "puter"
    GROQ = "groq"

class ModelTier(Enum):
    """Model capability tiers"""
    PREMIUM = "premium"      # Best quality, higher latency
    BALANCED = "balanced"    # Good quality, reasonable latency
    FAST = "fast"           # Lower quality, fast response

@dataclass
class ModelConfig:
    """Configuration for an AI model"""
    name: str
    provider: ProviderType
    tier: ModelTier
    context_length: int
    supports_json: bool = True
    supports_vision: bool = False
    max_tokens: int = 4096
    temperature_range: Tuple[float, float] = (0.0, 2.0)
    specialties: List[str] = field(default_factory=list)

@dataclass
class GenerationResult:
    """Result from AI generation"""
    text: str
    model: str
    provider: str
    tokens_used: int = 0
    tokens_generated: int = 0
    latency_ms: float = 0.0
    cost_estimate: float = 0.0
    cached: bool = False
    timestamp: datetime = field(default_factory=datetime.now)

@dataclass
class ProviderStatus:
    """Status tracking for a provider"""
    provider: ProviderType
    available: bool = True
    last_error: Optional[str] = None
    error_count: int = 0
    request_count: int = 0
    avg_latency_ms: float = 0.0
    last_used: Optional[datetime] = None
    rate_limit_remaining: int = 1000

class SimpleCache:
    """Simple in-memory cache for AI responses"""
    
    def __init__(self, ttl_seconds: int = 3600, max_size: int = 1000):
        self.cache: Dict[str, Dict] = {}
        self.ttl_seconds = ttl_seconds
        self.max_size = max_size
        self.hits = 0
        self.misses = 0
    
    def _generate_key(self, prompt: str, model: str, **kwargs) -> str:
        """Generate cache key from request parameters"""
        key_data = f"{prompt}:{model}:{json.dumps(kwargs, sort_keys=True)}"
        return hashlib.sha256(key_data.encode()).hexdigest()
    
    def get(self, prompt: str, model: str, **kwargs) -> Optional[Dict]:
        """Get cached response if available and not expired"""
        key = self._generate_key(prompt, model, **kwargs)
        
        if key in self.cache:
            entry = self.cache[key]
            if datetime.now() - entry['timestamp'] < timedelta(seconds=self.ttl_seconds):
                self.hits += 1
                return entry['data']
            else:
                # Expired
                del self.cache[key]
        
        self.misses += 1
        return None
    
    def set(self, prompt: str, model: str, data: Dict, **kwargs):
        """Cache a response"""
        # Evict oldest if at capacity
        if len(self.cache) >= self.max_size:
            oldest_key = min(self.cache.keys(), 
                           key=lambda k: self.cache[k]['timestamp'])
            del self.cache[oldest_key]
        
        key = self._generate_key(prompt, model, **kwargs)
        self.cache[key] = {
            'data': data,
            'timestamp': datetime.now()
        }
    
    def get_stats(self) -> Dict[str, int]:
        """Get cache statistics"""
        total = self.hits + self.misses
        return {
            'hits': self.hits,
            'misses': self.misses,
            'size': len(self.cache),
            'hit_rate': self.hits / total if total > 0 else 0
        }

class GradeAAISwarm:
    """
    Multi-Provider AI Client with Smart Routing
    
    Routing Strategy:
    1. Primary: NVIDIA NIM API (Mistral Large, DeepSeek, Stockmark)
    2. Secondary: OpenRouter (Palmyra, Solar Pro, Upstage)
    3. Tertiary: Puter AI (Palmyra X5)
    4. Fallback: Groq (Llama, Mixtral)
    """
    
    # Model configurations
    MODELS = {
        # NVIDIA NIM Models (Primary)
        "nvidia/mistral-large": ModelConfig(
            name="nvidia/mistral-large",
            provider=ProviderType.NVIDIA,
            tier=ModelTier.PREMIUM,
            context_length=32000,
            supports_json=True,
            supports_vision=True,
            max_tokens=4096,
            specialties=["general", "analysis", "coding", "reasoning"]
        ),
        "nvidia/deepseek": ModelConfig(
            name="nvidia/deepseek",
            provider=ProviderType.NVIDIA,
            tier=ModelTier.PREMIUM,
            context_length=128000,
            supports_json=True,
            max_tokens=4096,
            specialties=["long_context", "analysis", "summarization"]
        ),
        "nvidia/stockmark": ModelConfig(
            name="nvidia/stockmark",
            provider=ProviderType.NVIDIA,
            tier=ModelTier.BALANCED,
            context_length=16000,
            supports_json=True,
            max_tokens=2048,
            specialties=["financial", "analysis", "content"]
        ),
        
        # OpenRouter Models (Secondary)
        "openrouter/palmyra": ModelConfig(
            name="openrouter/palmyra",
            provider=ProviderType.OPENROUTER,
            tier=ModelTier.BALANCED,
            context_length=32000,
            supports_json=True,
            max_tokens=4096,
            specialties=["general", "instruction_following"]
        ),
        "openrouter/solar-pro": ModelConfig(
            name="openrouter/solar-pro",
            provider=ProviderType.OPENROUTER,
            tier=ModelTier.BALANCED,
            context_length=16384,
            supports_json=True,
            max_tokens=4096,
            specialties=["coding", "technical"]
        ),
        
        # Groq Models (Fallback)
        "groq/llama-3.1-70b": ModelConfig(
            name="groq/llama-3.1-70b-versatile",
            provider=ProviderType.GROQ,
            tier=ModelTier.FAST,
            context_length=128000,
            supports_json=True,
            max_tokens=8192,
            specialties=["fast", "general", "coding"]
        ),
        "groq/mixtral-8x7b": ModelConfig(
            name="groq/mixtral-8x7b-32768",
            provider=ProviderType.GROQ,
            tier=ModelTier.FAST,
            context_length=32768,
            supports_json=True,
            max_tokens=4096,
            specialties=["fast", "general"]
        ),
    }
    
    def __init__(self, enable_caching: bool = True, cache_ttl: int = 3600):
        """Initialize the AI Swarm"""
        self.enable_caching = enable_caching
        self.cache = SimpleCache(ttl_seconds=cache_ttl) if enable_caching else None
        
        # Provider status tracking
        self.provider_status: Dict[ProviderType, ProviderStatus] = {
            provider: ProviderStatus(provider=provider)
            for provider in ProviderType
        }
        
        # Load API keys from environment
        self.api_keys = self._load_api_keys()
        
        # Circuit breaker settings
        self.max_errors = 5
        self.circuit_timeout_seconds = 300  # 5 minutes
        
        logger.info("Grade A AI Swarm initialized")
        logger.info(f"Available providers: {list(self.api_keys.keys())}")
    
    def _load_api_keys(self) -> Dict[ProviderType, str]:
        """Load API keys from environment variables"""
        keys = {}
        
        # NVIDIA API Keys
        nvidia_mistral = os.getenv('NVIDIA_MISTRAL_API_KEY')
        nvidia_deepseek = os.getenv('NVIDIA_DEEPSEEK_API_KEY')
        nvidia_stockmark = os.getenv('NVIDIA_STOCKMARK_API_KEY')
        
        # Use first available NVIDIA key
        if nvidia_mistral:
            keys[ProviderType.NVIDIA] = nvidia_mistral
        elif nvidia_deepseek:
            keys[ProviderType.NVIDIA] = nvidia_deepseek
        elif nvidia_stockmark:
            keys[ProviderType.NVIDIA] = nvidia_stockmark
        
        # OpenRouter API Keys
        openrouter_key = os.getenv('OPENROUTER_API_KEY')
        openrouter_palmyra = os.getenv('OPENROUTER_PALMYRA_API_KEY')
        
        if openrouter_key:
            keys[ProviderType.OPENROUTER] = openrouter_key
        elif openrouter_palmyra:
            keys[ProviderType.OPENROUTER] = openrouter_palmyra
        
        # Puter AI Key (if available)
        puter_key = os.getenv('PUTER_API_KEY')
        if puter_key:
            keys[ProviderType.PUTER] = puter_key
        
        # Groq Key (if available)
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key:
            keys[ProviderType.GROQ] = groq_key
        
        return keys
    
    def _get_provider_for_model(self, model_name: str) -> Optional[ProviderType]:
        """Get provider type for a model"""
        if model_name not in self.MODELS:
            return None
        return self.MODELS[model_name].provider
    
    def _is_provider_available(self, provider: ProviderType) -> bool:
        """Check if a provider is available (circuit breaker)"""
        status = self.provider_status[provider]
        
        if not status.available:
            # Check if circuit should be reset
            if status.last_used:
                time_since_error = (datetime.now() - status.last_used).total_seconds()
                if time_since_error > self.circuit_timeout_seconds:
                    logger.info(f"Resetting circuit breaker for {provider.value}")
                    status.available = True
                    status.error_count = 0
                    status.last_error = None
                    return True
            return False
        
        # Check if we've hit error threshold
        if status.error_count >= self.max_errors:
            status.available = False
            logger.warning(f"Circuit breaker opened for {provider.value}")
            return False
        
        return True
    
    def _mark_provider_error(self, provider: ProviderType, error: str):
        """Mark a provider as having an error"""
        status = self.provider_status[provider]
        status.error_count += 1
        status.last_error = error
        status.last_used = datetime.now()
        
        if status.error_count >= self.max_errors:
            status.available = False
            logger.warning(f"Circuit breaker opened for {provider.value}: {error}")
    
    def _mark_provider_success(self, provider: ProviderType, latency_ms: float):
        """Mark a provider as successful"""
        status = self.provider_status[provider]
        status.request_count += 1
        status.last_used = datetime.now()
        
        # Update average latency
        if status.avg_latency_ms == 0:
            status.avg_latency_ms = latency_ms
        else:
            status.avg_latency_ms = (status.avg_latency_ms * 0.9) + (latency_ms * 0.1)
        
        # Reset error count on success
        if status.error_count > 0:
            status.error_count = max(0, status.error_count - 1)
    
    def select_model(self, task_type: str = "general", 
                     preferred_tier: Optional[ModelTier] = None,
                     require_json: bool = False) -> str:
        """
        Select best model for task based on routing strategy
        
        Routing Priority:
        1. Primary: NVIDIA NIM
        2. Secondary: OpenRouter
        3. Tertiary: Puter AI
        4. Fallback: Groq
        """
        candidates = []
        
        for model_name, config in self.MODELS.items():
            # Check provider availability
            if not self._is_provider_available(config.provider):
                continue
            
            # Check API key availability
            if config.provider not in self.api_keys:
                continue
            
            # Check tier preference
            if preferred_tier and config.tier != preferred_tier:
                continue
            
            # Check JSON support requirement
            if require_json and not config.supports_json:
                continue
            
            # Check if provider supports this task
            if task_type not in config.specialties and "general" not in config.specialties:
                # Still allow but with lower priority
                priority = 4  # Lowest
            else:
                # Assign priority based on routing strategy
                if config.provider == ProviderType.NVIDIA:
                    priority = 1  # Primary
                elif config.provider == ProviderType.OPENROUTER:
                    priority = 2  # Secondary
                elif config.provider == ProviderType.PUTER:
                    priority = 3  # Tertiary
                else:
                    priority = 4  # Fallback
            
            candidates.append((model_name, config, priority))
        
        if not candidates:
            # Fallback to any available model
            logger.warning("No preferred models available, using fallback")
            for model_name, config in self.MODELS.items():
                if config.provider in self.api_keys:
                    return model_name
            raise RuntimeError("No AI providers available")
        
        # Sort by priority (lower is better)
        candidates.sort(key=lambda x: x[2])
        
        # Return best available model
        return candidates[0][0]
    
    async def generate(self, 
                      prompt: str,
                      model: Optional[str] = None,
                      temperature: float = 0.7,
                      max_tokens: Optional[int] = None,
                      system_prompt: Optional[str] = None,
                      json_mode: bool = False,
                      task_type: str = "general",
                      timeout: int = 60) -> Dict[str, Any]:
        """
        Generate content using the AI Swarm
        
        Args:
            prompt: The prompt to send
            model: Specific model to use (auto-selected if None)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            system_prompt: Optional system prompt
            json_mode: Whether to request JSON output
            task_type: Type of task for model selection
            timeout: Request timeout in seconds
            
        Returns:
            Generation result dictionary
        """
        # Auto-select model if not specified
        if model is None:
            preferred_tier = None
            if task_type in ["analysis", "reasoning", "summarization"]:
                preferred_tier = ModelTier.PREMIUM
            elif task_type in ["fast", "simple"]:
                preferred_tier = ModelTier.FAST
            
            model = self.select_model(
                task_type=task_type,
                preferred_tier=preferred_tier,
                require_json=json_mode
            )
        
        # Check cache
        if self.cache and not json_mode:  # Don't cache JSON mode requests (often unique)
            cached = self.cache.get(prompt, model, 
                                   temperature=temperature, 
                                   max_tokens=max_tokens,
                                   system_prompt=system_prompt)
            if cached:
                logger.debug(f"Cache hit for {model}")
                cached['cached'] = True
                return cached
        
        # Get model configuration
        config = self.MODELS.get(model)
        if not config:
            raise ValueError(f"Unknown model: {model}")
        
        # Execute generation
        start_time = time.time()
        
        try:
            if config.provider == ProviderType.NVIDIA:
                result = await self._call_nvidia(
                    prompt, config, temperature, max_tokens, system_prompt, json_mode, timeout
                )
            elif config.provider == ProviderType.OPENROUTER:
                result = await self._call_openrouter(
                    prompt, config, temperature, max_tokens, system_prompt, json_mode, timeout
                )
            elif config.provider == ProviderType.PUTER:
                result = await self._call_puter(
                    prompt, config, temperature, max_tokens, system_prompt, json_mode, timeout
                )
            elif config.provider == ProviderType.GROQ:
                result = await self._call_groq(
                    prompt, config, temperature, max_tokens, system_prompt, json_mode, timeout
                )
            else:
                raise ValueError(f"Unknown provider: {config.provider}")
            
            # Calculate latency
            latency_ms = (time.time() - start_time) * 1000
            
            # Mark success
            self._mark_provider_success(config.provider, latency_ms)
            
            # Add metadata
            result['latency_ms'] = latency_ms
            result['model'] = model
            result['provider'] = config.provider.value
            result['cached'] = False
            result['timestamp'] = datetime.now().isoformat()
            
            # Cache result
            if self.cache and not json_mode:
                self.cache.set(prompt, model, result,
                             temperature=temperature,
                             max_tokens=max_tokens,
                             system_prompt=system_prompt)
            
            return result
            
        except Exception as e:
            # Mark error
            self._mark_provider_error(config.provider, str(e))
            
            # Retry with fallback if this wasn't already a fallback
            if config.provider != ProviderType.GROQ:
                logger.warning(f"{model} failed, trying fallback: {e}")
                fallback_model = self.select_model(task_type=task_type, require_json=json_mode)
                if fallback_model != model:
                    return await self.generate(
                        prompt=prompt,
                        model=fallback_model,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        system_prompt=system_prompt,
                        json_mode=json_mode,
                        task_type=task_type,
                        timeout=timeout
                    )
            
            raise
    
    async def _call_nvidia(self, prompt: str, config: ModelConfig,
                          temperature: float, max_tokens: Optional[int],
                          system_prompt: Optional[str], json_mode: bool,
                          timeout: int) -> Dict[str, Any]:
        """Call NVIDIA NIM API"""
        import aiohttp
        
        api_key = self.api_keys.get(ProviderType.NVIDIA)
        if not api_key:
            raise RuntimeError("NVIDIA API key not configured")
        
        # Map model name to NVIDIA endpoint
        model_map = {
            "nvidia/mistral-large": "mistralai/mistral-large",
            "nvidia/deepseek": "deepseek-ai/deepseek-llm",
            "nvidia/stockmark": "stockmark/stockmark-13b-instruct"
        }
        
        nv_model = model_map.get(config.name, config.name)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": nv_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens or config.max_tokens
        }
        
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    "https://integrate.api.nvidia.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=timeout
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise RuntimeError(f"NVIDIA API error {response.status}: {error_text}")
                    
                    data = await response.json()
                    
                    return {
                        'text': data['choices'][0]['message']['content'],
                        'tokens_used': data.get('usage', {}).get('total_tokens', 0),
                        'tokens_generated': data.get('usage', {}).get('completion_tokens', 0),
                        'finish_reason': data['choices'][0].get('finish_reason', 'unknown')
                    }
            except asyncio.TimeoutError:
                raise RuntimeError(f"NVIDIA API timeout after {timeout}s")
    
    async def _call_openrouter(self, prompt: str, config: ModelConfig,
                              temperature: float, max_tokens: Optional[int],
                              system_prompt: Optional[str], json_mode: bool,
                              timeout: int) -> Dict[str, Any]:
        """Call OpenRouter API"""
        import aiohttp
        
        api_key = self.api_keys.get(ProviderType.OPENROUTER)
        if not api_key:
            raise RuntimeError("OpenRouter API key not configured")
        
        # Map model names to OpenRouter format
        model_map = {
            "openrouter/palmyra": "writer/palmyra-x5",
            "openrouter/solar-pro": "upstage/solar-pro"
        }
        
        or_model = model_map.get(config.name, config.name.replace("openrouter/", ""))
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ppsdm.kmm.its.ac.id",
            "X-Title": "PPSDM KMM Content Factory"
        }
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": or_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens or config.max_tokens
        }
        
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=timeout
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise RuntimeError(f"OpenRouter API error {response.status}: {error_text}")
                    
                    data = await response.json()
                    
                    return {
                        'text': data['choices'][0]['message']['content'],
                        'tokens_used': data.get('usage', {}).get('total_tokens', 0),
                        'tokens_generated': data.get('usage', {}).get('completion_tokens', 0),
                        'finish_reason': data['choices'][0].get('finish_reason', 'unknown')
                    }
            except asyncio.TimeoutError:
                raise RuntimeError(f"OpenRouter API timeout after {timeout}s")
    
    async def _call_puter(self, prompt: str, config: ModelConfig,
                         temperature: float, max_tokens: Optional[int],
                         system_prompt: Optional[str], json_mode: bool,
                         timeout: int) -> Dict[str, Any]:
        """Call Puter AI API"""
        # Placeholder for Puter AI integration
        # This would be implemented when Puter AI API is available
        raise NotImplementedError("Puter AI integration not yet implemented")
    
    async def _call_groq(self, prompt: str, config: ModelConfig,
                        temperature: float, max_tokens: Optional[int],
                        system_prompt: Optional[str], json_mode: bool,
                        timeout: int) -> Dict[str, Any]:
        """Call Groq API as fallback"""
        import aiohttp
        
        api_key = self.api_keys.get(ProviderType.GROQ)
        if not api_key:
            raise RuntimeError("Groq API key not configured")
        
        # Map model names
        model_map = {
            "groq/llama-3.1-70b": "llama-3.1-70b-versatile",
            "groq/mixtral-8x7b": "mixtral-8x7b-32768"
        }
        
        groq_model = model_map.get(config.name, config.name.replace("groq/", ""))
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": groq_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens or config.max_tokens
        }
        
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=timeout
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise RuntimeError(f"Groq API error {response.status}: {error_text}")
                    
                    data = await response.json()
                    
                    return {
                        'text': data['choices'][0]['message']['content'],
                        'tokens_used': data.get('usage', {}).get('total_tokens', 0),
                        'tokens_generated': data.get('usage', {}).get('completion_tokens', 0),
                        'finish_reason': data['choices'][0].get('finish_reason', 'unknown')
                    }
            except asyncio.TimeoutError:
                raise RuntimeError(f"Groq API timeout after {timeout}s")
    
    async def batch_generate(self, prompts: List[str], 
                            model: Optional[str] = None,
                            **kwargs) -> List[Dict[str, Any]]:
        """Generate multiple prompts in parallel with rate limiting"""
        semaphore = asyncio.Semaphore(5)  # Max 5 concurrent requests
        
        async def generate_with_limit(prompt: str) -> Dict[str, Any]:
            async with semaphore:
                return await self.generate(prompt, model=model, **kwargs)
        
        tasks = [generate_with_limit(p) for p in prompts]
        return await asyncio.gather(*tasks, return_exceptions=True)
    
    def get_provider_stats(self) -> Dict[str, Dict]:
        """Get statistics for all providers"""
        stats = {}
        for provider, status in self.provider_status.items():
            stats[provider.value] = {
                'available': status.available,
                'error_count': status.error_count,
                'request_count': status.request_count,
                'avg_latency_ms': round(status.avg_latency_ms, 2),
                'last_error': status.last_error
            }
        
        if self.cache:
            stats['cache'] = self.cache.get_stats()
        
        return stats
    
    async def health_check(self) -> Dict[str, bool]:
        """Check health of all providers"""
        results = {}
        
        for provider in ProviderType:
            if provider not in self.api_keys:
                results[provider.value] = False
                continue
            
            try:
                # Quick test call
                test_prompt = "Say 'OK' and nothing else."
                await self.generate(
                    prompt=test_prompt,
                    model=self.select_model(),
                    max_tokens=10,
                    timeout=10
                )
                results[provider.value] = True
            except Exception as e:
                logger.warning(f"Health check failed for {provider.value}: {e}")
                results[provider.value] = False
        
        return results


# ==================== CLI TESTING ====================

async def test_swarm():
    """Test the AI Swarm"""
    print("Testing Grade A AI Swarm...")
    print("=" * 60)
    
    swarm = GradeAAISwarm()
    
    # Check provider stats
    print("\nProvider Status:")
    stats = swarm.get_provider_stats()
    for provider, stat in stats.items():
        if provider != 'cache':
            status = "✓" if stat['available'] else "✗"
            print(f"  {status} {provider}: {stat['request_count']} requests, "
                  f"avg {stat['avg_latency_ms']}ms")
    
    # Test generation
    print("\nTest Generation:")
    try:
        result = await swarm.generate(
            prompt="What is the capital of France? Answer in one word.",
            temperature=0.1,
            max_tokens=50
        )
        print(f"  Model: {result['model']}")
        print(f"  Provider: {result['provider']}")
        print(f"  Response: {result['text'].strip()}")
        print(f"  Latency: {result['latency_ms']:.0f}ms")
    except Exception as e:
        print(f"  ✗ Generation failed: {e}")
    
    print("\n" + "=" * 60)


if __name__ == '__main__':
    asyncio.run(test_swarm())
