#!/usr/bin/env python3
"""
AI Integration Module for PPSDM KMM System
Provides simple interface to AI models with automatic fallback
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
from typing import Optional, Dict, List
from dataclasses import dataclass
from enum import Enum

load_dotenv('.env.local')

class AIModel(Enum):
    NEMOTRON = "nemotron"
    GLM4 = "glm4"
    AUTO = "auto"

@dataclass
class AIResponse:
    model: str
    content: str
    success: bool
    error: Optional[str] = None

class AIProvider:
    """Simple AI provider with automatic fallback"""
    
    def __init__(self):
        self.nemotron_key = os.getenv('NEMOTRON_API_KEY')
        self.glm4_key = os.getenv('NVIDIA_API_KEY_GLM4')
        self.base_url = "https://integrate.api.nvidia.com/v1"
    
    def chat(self, 
             message: str,
             model: AIModel = AIModel.AUTO,
             max_tokens: int = 1024,
             temperature: float = 0.7) -> AIResponse:
        """
        Simple chat interface
        
        Args:
            message: User message
            model: Which model to use (AUTO = Nemotron with GLM4 fallback)
            max_tokens: Max tokens in response
            temperature: Response temperature (0-2)
        
        Returns:
            AIResponse with content or error
        """
        
        if model == AIModel.AUTO or model == AIModel.NEMOTRON:
            # Try Nemotron first (faster, cheaper)
            response = self._query_model(
                "nemotron",
                self.nemotron_key,
                "nvidia/nemotron-3-nano-30b-a3b",
                message,
                max_tokens,
                temperature
            )
            if response.success:
                return response
            
            # Fallback to GLM4
            return self._query_model(
                "glm4",
                self.glm4_key,
                "z-ai/glm4.7",
                message,
                max_tokens,
                temperature
            )
        
        elif model == AIModel.GLM4:
            return self._query_model(
                "glm4",
                self.glm4_key,
                "z-ai/glm4.7",
                message,
                max_tokens,
                temperature
            )
    
    def _query_model(self,
                     model_name: str,
                     api_key: str,
                     model_id: str,
                     message: str,
                     max_tokens: int,
                     temperature: float) -> AIResponse:
        """Internal method to query a specific model"""
        
        try:
            if not api_key:
                return AIResponse(
                    model=model_name,
                    content="",
                    success=False,
                    error=f"No API key for {model_name}"
                )
            
            client = OpenAI(base_url=self.base_url, api_key=api_key)
            
            completion = client.chat.completions.create(
                model=model_id,
                messages=[{"role": "user", "content": message}],
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )
            
            return AIResponse(
                model=model_name,
                content=completion.choices[0].message.content,
                success=True
            )
        
        except Exception as e:
            return AIResponse(
                model=model_name,
                content="",
                success=False,
                error=str(e)
            )
    
    def batch_query(self, messages: List[str], model: AIModel = AIModel.AUTO) -> List[AIResponse]:
        """Query multiple messages"""
        return [self.chat(msg, model) for msg in messages]

# Global instance
_provider = None

def get_provider() -> AIProvider:
    """Get or create AI provider instance"""
    global _provider
    if _provider is None:
        _provider = AIProvider()
    return _provider

def ask(message: str, model: AIModel = AIModel.AUTO) -> str:
    """Simple ask function - returns just the response text"""
    response = get_provider().chat(message, model)
    if response.success:
        return response.content
    else:
        raise Exception(f"AI Query failed: {response.error}")

# Example usage
if __name__ == "__main__":
    print("Testing AI Provider Integration...\n")
    
    # Test 1: Simple query
    print("Test 1: Simple Query")
    print("-" * 50)
    response = get_provider().chat("What is Python?")
    print(f"Model: {response.model}")
    print(f"Status: {'✅ Success' if response.success else '❌ Failed'}")
    if response.success:
        print(f"Response: {response.content[:100]}...\n")
    else:
        print(f"Error: {response.error}\n")
    
    # Test 2: Specific model
    print("Test 2: GLM4 Specific Query")
    print("-" * 50)
    response = get_provider().chat("Explain blockchain", model=AIModel.GLM4)
    print(f"Model: {response.model}")
    print(f"Status: {'✅ Success' if response.success else '❌ Failed'}")
    if response.success:
        print(f"Response: {response.content[:100]}...\n")
    else:
        print(f"Error: {response.error}\n")
    
    # Test 3: Simple ask function
    print("Test 3: Simple Ask Function")
    print("-" * 50)
    try:
        result = ask("Count 1 to 5")
        print(f"Result: {result}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n✅ Integration module ready for use!")
