#!/usr/bin/env python3
"""
Multi-API Content Generator

Uses all available AI APIs for content generation with automatic fallback:
- Groq (fastest)
- OpenAI (most reliable)
- OpenRouter (multi-provider access)
- Hugging Face (open source)
- Google AI (Gemini)

Usage:
    python multi_api_content_generator.py --prompt "Generate content about..."
    python multi_api_content_generator.py --file input.txt --output output.json
"""

import os
import sys
import json
import time
import argparse
from dataclasses import dataclass, asdict
from typing import Optional, Dict, List, Callable, Any
from enum import Enum
import concurrent.futures

# Try to import required libraries
try:
    import requests
except ImportError:
    print("Error: requests library not installed. Run: pip install requests")
    sys.exit(1)


class ProviderPriority(Enum):
    """Priority order for AI providers"""
    GROQ = 1
    OPENAI = 2
    OPENROUTER = 3
    GOOGLE = 4
    HUGGINGFACE = 5


@dataclass
class GenerationResult:
    """Result from AI generation"""
    content: str
    provider: str
    model: str
    latency_ms: float
    tokens_used: Optional[int] = None
    error: Optional[str] = None
    success: bool = True


@dataclass
class ProviderConfig:
    """Configuration for an AI provider"""
    name: str
    api_key: Optional[str]
    base_url: str
    models: Dict[str, str]
    priority: int
    enabled: bool = True


class MultiAIProvider:
    """
    Multi-provider AI router with fallback capabilities.
    Automatically tries providers in priority order until one succeeds.
    """
    
    def __init__(self):
        self.providers: Dict[str, ProviderConfig] = {
            'groq': ProviderConfig(
                name='Groq',
                api_key=os.getenv('GROQ_API_KEY'),
                base_url='https://api.groq.com/openai/v1/chat/completions',
                models={
                    'fast': 'llama-3.1-8b-instant',
                    'balanced': 'llama-3.3-70b-versatile',
                    'powerful': 'mixtral-8x7b-32768'
                },
                priority=1
            ),
            'openai': ProviderConfig(
                name='OpenAI',
                api_key=os.getenv('OPENAI_API_KEY'),
                base_url='https://api.openai.com/v1/chat/completions',
                models={
                    'fast': 'gpt-4o-mini',
                    'balanced': 'gpt-4o',
                    'powerful': 'gpt-4-turbo'
                },
                priority=2
            ),
            'openrouter': ProviderConfig(
                name='OpenRouter',
                api_key=os.getenv('OPENROUTER_API_KEY'),
                base_url='https://openrouter.ai/api/v1/chat/completions',
                models={
                    'fast': 'google/gemma-2-9b-it',
                    'balanced': 'anthropic/claude-3.5-sonnet',
                    'powerful': 'anthropic/claude-3-opus'
                },
                priority=3
            ),
            'google': ProviderConfig(
                name='Google AI',
                api_key=os.getenv('GOOGLE_AI_API_KEY'),
                base_url='https://generativelanguage.googleapis.com/v1beta/models',
                models={
                    'fast': 'gemini-1.5-flash',
                    'balanced': 'gemini-1.5-pro',
                    'powerful': 'gemini-1.5-pro'
                },
                priority=4
            ),
            'huggingface': ProviderConfig(
                name='Hugging Face',
                api_key=os.getenv('HUGGINGFACE_API_KEY'),
                base_url='https://api-inference.huggingface.co/models',
                models={
                    'fast': 'mistralai/Mistral-7B-Instruct-v0.2',
                    'balanced': 'meta-llama/Llama-2-70b-chat-hf',
                    'powerful': 'meta-llama/Llama-2-70b-chat-hf'
                },
                priority=5
            ),
        }
        
        # Disable providers without API keys
        for name, config in self.providers.items():
            if not config.api_key:
                config.enabled = False
                print(f"⚠️  {name} disabled: No API key found")
    
    def get_available_providers(self) -> List[str]:
        """Get list of enabled providers sorted by priority"""
        return sorted(
            [name for name, config in self.providers.items() if config.enabled],
            key=lambda x: self.providers[x].priority
        )
    
    def generate_with_groq(
        self, 
        prompt: str, 
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> GenerationResult:
        """Generate content using Groq API"""
        config = self.providers['groq']
        start_time = time.time()
        
        headers = {
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        }
        
        messages = []
        if system_prompt:
            messages.append({'role': 'system', 'content': system_prompt})
        messages.append({'role': 'user', 'content': prompt})
        
        data = {
            'model': config.models[model],
            'messages': messages,
            'temperature': temperature,
            'max_tokens': max_tokens
        }
        
        response = requests.post(config.base_url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        latency = (time.time() - start_time) * 1000
        
        return GenerationResult(
            content=result['choices'][0]['message']['content'],
            provider='Groq',
            model=config.models[model],
            latency_ms=latency,
            tokens_used=result.get('usage', {}).get('total_tokens')
        )
    
    def generate_with_openai(
        self, 
        prompt: str, 
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> GenerationResult:
        """Generate content using OpenAI API"""
        config = self.providers['openai']
        start_time = time.time()
        
        headers = {
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        }
        
        messages = []
        if system_prompt:
            messages.append({'role': 'system', 'content': system_prompt})
        messages.append({'role': 'user', 'content': prompt})
        
        data = {
            'model': config.models[model],
            'messages': messages,
            'temperature': temperature,
            'max_tokens': max_tokens
        }
        
        response = requests.post(config.base_url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        latency = (time.time() - start_time) * 1000
        
        return GenerationResult(
            content=result['choices'][0]['message']['content'],
            provider='OpenAI',
            model=config.models[model],
            latency_ms=latency,
            tokens_used=result.get('usage', {}).get('total_tokens')
        )
    
    def generate_with_openrouter(
        self, 
        prompt: str, 
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> GenerationResult:
        """Generate content using OpenRouter API"""
        config = self.providers['openrouter']
        start_time = time.time()
        
        headers = {
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://ppsdm-kmm.com',
            'X-Title': 'PPSDM KMM Content Generator'
        }
        
        messages = []
        if system_prompt:
            messages.append({'role': 'system', 'content': system_prompt})
        messages.append({'role': 'user', 'content': prompt})
        
        data = {
            'model': config.models[model],
            'messages': messages,
            'temperature': temperature,
            'max_tokens': max_tokens
        }
        
        response = requests.post(config.base_url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        latency = (time.time() - start_time) * 1000
        
        return GenerationResult(
            content=result['choices'][0]['message']['content'],
            provider='OpenRouter',
            model=config.models[model],
            latency_ms=latency,
            tokens_used=result.get('usage', {}).get('total_tokens')
        )
    
    def generate_with_google(
        self, 
        prompt: str, 
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> GenerationResult:
        """Generate content using Google AI (Gemini) API"""
        config = self.providers['google']
        start_time = time.time()
        
        url = f"{config.base_url}/{config.models[model]}:generateContent"
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        data = {
            'contents': [{
                'parts': [{'text': prompt}]
            }],
            'generationConfig': {
                'temperature': temperature,
                'maxOutputTokens': max_tokens
            }
        }
        
        params = {'key': config.api_key}
        
        response = requests.post(url, headers=headers, json=data, params=params)
        response.raise_for_status()
        result = response.json()
        
        latency = (time.time() - start_time) * 1000
        
        content = result['candidates'][0]['content']['parts'][0]['text']
        
        return GenerationResult(
            content=content,
            provider='Google AI',
            model=config.models[model],
            latency_ms=latency
        )
    
    def generate_with_huggingface(
        self, 
        prompt: str, 
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> GenerationResult:
        """Generate content using Hugging Face Inference API"""
        config = self.providers['huggingface']
        start_time = time.time()
        
        url = f"{config.base_url}/{config.models[model]}"
        
        headers = {
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        }
        
        full_prompt = prompt
        if system_prompt:
            full_prompt = f"{system_prompt}\n\nUser: {prompt}\nAssistant:"
        else:
            full_prompt = f"User: {prompt}\nAssistant:"
        
        data = {
            'inputs': full_prompt,
            'parameters': {
                'temperature': temperature,
                'max_new_tokens': max_tokens,
                'return_full_text': False
            }
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        latency = (time.time() - start_time) * 1000
        
        content = result[0]['generated_text'] if isinstance(result, list) else result.get('generated_text', '')
        
        return GenerationResult(
            content=content,
            provider='Hugging Face',
            model=config.models[model],
            latency_ms=latency
        )
    
    def generate(
        self,
        prompt: str,
        priority: List[str] = None,
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        timeout: int = 60
    ) -> GenerationResult:
        """
        Generate content with automatic provider fallback.
        
        Args:
            prompt: The prompt to send to the AI
            priority: List of provider names in priority order (default: by config priority)
            model: Model tier ('fast', 'balanced', 'powerful')
            system_prompt: Optional system prompt
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            timeout: Timeout per provider in seconds
            
        Returns:
            GenerationResult with content from the first successful provider
        """
        if priority is None:
            priority = self.get_available_providers()
        
        # Map provider names to their generation functions
        provider_methods: Dict[str, Callable] = {
            'groq': self.generate_with_groq,
            'openai': self.generate_with_openai,
            'openrouter': self.generate_with_openrouter,
            'google': self.generate_with_google,
            'huggingface': self.generate_with_huggingface,
        }
        
        errors = []
        
        for provider_name in priority:
            if provider_name not in self.providers:
                errors.append(f"{provider_name}: Unknown provider")
                continue
            
            config = self.providers[provider_name]
            if not config.enabled:
                errors.append(f"{provider_name}: Not enabled")
                continue
            
            try:
                print(f"🔄 Trying {config.name}...")
                method = provider_methods[provider_name]
                
                # Use timeout for the request
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(
                        method,
                        prompt,
                        model,
                        system_prompt,
                        temperature,
                        max_tokens
                    )
                    result = future.result(timeout=timeout)
                
                print(f"✅ Success with {config.name} ({result.latency_ms:.0f}ms)")
                return result
                
            except Exception as e:
                error_msg = str(e)
                errors.append(f"{config.name}: {error_msg}")
                print(f"❌ {config.name} failed: {error_msg}")
                continue
        
        # All providers failed
        return GenerationResult(
            content="",
            provider="None",
            model="",
            latency_ms=0,
            error=f"All providers failed: {'; '.join(errors)}",
            success=False
        )
    
    def generate_all(
        self,
        prompt: str,
        model: str = 'balanced',
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> Dict[str, GenerationResult]:
        """
        Generate content with ALL available providers and return all results.
        Useful for comparing outputs or ensemble methods.
        """
        provider_methods: Dict[str, Callable] = {
            'groq': self.generate_with_groq,
            'openai': self.generate_with_openai,
            'openrouter': self.generate_with_openrouter,
            'google': self.generate_with_google,
            'huggingface': self.generate_with_huggingface,
        }
        
        results = {}
        
        for provider_name in self.get_available_providers():
            config = self.providers[provider_name]
            try:
                print(f"🔄 Generating with {config.name}...")
                method = provider_methods[provider_name]
                result = method(prompt, model, system_prompt, temperature, max_tokens)
                results[provider_name] = result
            except Exception as e:
                results[provider_name] = GenerationResult(
                    content="",
                    provider=config.name,
                    model=config.models[model],
                    latency_ms=0,
                    error=str(e),
                    success=False
                )
        
        return results


def main():
    parser = argparse.ArgumentParser(
        description='Multi-API Content Generator with Fallback'
    )
    parser.add_argument(
        '--prompt', '-p',
        type=str,
        help='Prompt to generate content from'
    )
    parser.add_argument(
        '--file', '-f',
        type=str,
        help='Read prompt from file'
    )
    parser.add_argument(
        '--output', '-o',
        type=str,
        help='Output file for results (JSON)'
    )
    parser.add_argument(
        '--model', '-m',
        type=str,
        default='balanced',
        choices=['fast', 'balanced', 'powerful'],
        help='Model tier to use'
    )
    parser.add_argument(
        '--provider', '-pr',
        type=str,
        help='Specific provider to use (default: auto with fallback)'
    )
    parser.add_argument(
        '--all', '-a',
        action='store_true',
        help='Generate with all providers for comparison'
    )
    parser.add_argument(
        '--system', '-s',
        type=str,
        help='System prompt'
    )
    parser.add_argument(
        '--temperature', '-t',
        type=float,
        default=0.7,
        help='Temperature (0.0-2.0)'
    )
    parser.add_argument(
        '--max-tokens', '-mt',
        type=int,
        default=2000,
        help='Maximum tokens to generate'
    )
    
    args = parser.parse_args()
    
    # Get prompt
    if args.file:
        with open(args.file, 'r') as f:
            prompt = f.read()
    elif args.prompt:
        prompt = args.prompt
    else:
        print("Error: Please provide --prompt or --file")
        parser.print_help()
        sys.exit(1)
    
    # Initialize multi-provider
    ai = MultiAIProvider()
    
    print(f"\n🚀 Multi-API Content Generator")
    print(f"   Available providers: {', '.join(ai.get_available_providers())}")
    print(f"   Model tier: {args.model}")
    print(f"   Temperature: {args.temperature}")
    print(f"   Max tokens: {args.max_tokens}\n")
    
    if args.all:
        # Generate with all providers
        print("Generating with all available providers...\n")
        results = ai.generate_all(
            prompt=prompt,
            model=args.model,
            system_prompt=args.system,
            temperature=args.temperature,
            max_tokens=args.max_tokens
        )
        
        # Display results
        for provider, result in results.items():
            print(f"\n{'='*60}")
            print(f"Provider: {result.provider}")
            print(f"Model: {result.model}")
            print(f"Latency: {result.latency_ms:.0f}ms")
            if result.error:
                print(f"Error: {result.error}")
            else:
                print(f"\nContent:\n{result.content[:500]}...")
        
        # Save to file if requested
        if args.output:
            output_data = {
                provider: asdict(result)
                for provider, result in results.items()
            }
            with open(args.output, 'w') as f:
                json.dump(output_data, f, indent=2)
            print(f"\n💾 Results saved to {args.output}")
    
    else:
        # Generate with fallback
        priority = [args.provider] if args.provider else None
        
        print(f"Prompt: {prompt[:100]}...\n")
        
        result = ai.generate(
            prompt=prompt,
            priority=priority,
            model=args.model,
            system_prompt=args.system,
            temperature=args.temperature,
            max_tokens=args.max_tokens
        )
        
        if result.success:
            print(f"\n✅ Generated successfully!")
            print(f"   Provider: {result.provider}")
            print(f"   Model: {result.model}")
            print(f"   Latency: {result.latency_ms:.0f}ms")
            if result.tokens_used:
                print(f"   Tokens: {result.tokens_used}")
            print(f"\nContent:\n{'='*60}")
            print(result.content)
            print('='*60)
            
            # Save to file if requested
            if args.output:
                with open(args.output, 'w') as f:
                    json.dump(asdict(result), f, indent=2)
                print(f"\n💾 Result saved to {args.output}")
        else:
            print(f"\n❌ Generation failed!")
            print(f"Error: {result.error}")
            sys.exit(1)


if __name__ == '__main__':
    main()
