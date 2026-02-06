#!/usr/bin/env python3
"""
Multi-Model Orchestrator (Super Version)
Leverages Nemotron (Coding), DeepSeek (Reasoning), Mistral (Review), and GLM (Fallback)
"""

import os
import sys
import json
import argparse
from typing import Optional, Dict
from datetime import datetime
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed

# Load env vars from .env.local
load_dotenv('.env.local')

# Force UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from openai import OpenAI
except ImportError:
    print("Error: 'openai' package not installed. Run 'pip install openai'")
    sys.exit(1)

# Model Configurations
MODELS = {
    "nemotron": {
        "id": "nvidia/nemotron-3-nano-30b-a3b",
        "api_key_var": "NEMOTRON_API_KEY",
        "role": "Coder/Executor",
        "kwargs": {"extra_body": {"reasoning_budget": 16384, "chat_template_kwargs": {"enable_thinking": True}}}
    },
    "deepseek": {
        "id": "deepseek-ai/deepseek-v3.2",
        "api_key_var": "NVIDIA_MULTI_API_KEY",
        "role": "Planner/Reasoning",
        "kwargs": {"extra_body": {"chat_template_kwargs": {"thinking": True}}}
    },
    "mistral": {
        "id": "mistralai/mistral-large-3-675b-instruct-2512",
        "api_key_var": "NVIDIA_MULTI_API_KEY",
        "role": "Reviewer/QA",
        "kwargs": {} 
    },
    "glm": {
        "id": "z-ai/glm4.7",
        "api_key_var": "GLM_API_KEY",
        "role": "Backup Planner",
        "kwargs": {"extra_body": {"chat_template_kwargs": {"enable_thinking": True, "clear_thinking": False}}}
    }
}

class ModelAgent:
    def __init__(self, name: str, config: Dict):
        self.name = name
        self.model_id = config["id"]
        self.role = config["role"]
        self.api_key = os.getenv(config["api_key_var"])
        self.kwargs = config["kwargs"]
        self.base_url = "https://integrate.api.nvidia.com/v1"
        self.client = None
        self.alive = False

        if self.api_key:
            try:
                self.client = OpenAI(base_url=self.base_url, api_key=self.api_key)
                self.alive = True
            except Exception as e:
                print(f"⚠️ Failed to init {self.name}: {e}")
        else:
            print(f"⚠️ Missing key for {self.name} ({config['api_key_var']})")

    def query(self, prompt: str, system_role: str = "You are a helpful assistant.", stream: bool = True) -> str:
        if not self.alive or not self.client:
            return ""
        
        print(f"\n🤖 {self.name} ({self.role}) Thinking...\n")
        try:
            completion = self.client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": system_role},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                top_p=0.9,
                max_tokens=4096,
                stream=stream,
                **self.kwargs
            )
            
            full_response = ""
            if stream:
                for chunk in completion:
                    if not chunk.choices: continue
                    delta = chunk.choices[0].delta
                    content = delta.content
                    if content:
                        print(content, end="", flush=True)
                        full_response += content
                print("\n")
            else:
                full_response = completion.choices[0].message.content
                print(full_response)
                
            return full_response
        except Exception as e:
            print(f"❌ Error querying {self.name}: {e}")
            return ""

    def ping(self) -> bool:
        if not self.client: return False
        try:
            self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role":"user", "content":"Hi"}],
                max_tokens=5
            )
            return True
        except Exception:
            return False

class Orchestrator:
    def __init__(self):
        self.agents = {}
        for name, config in MODELS.items():
            self.agents[name] = ModelAgent(name, config)

    def health_check(self):
        print("\n🏥 Performing Parallel Health Check...\n")
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = {executor.submit(agent.ping): name for name, agent in self.agents.items()}
            for future in as_completed(futures):
                name = futures[future]
                is_alive = future.result()
                status = "✅ ONLINE" if is_alive else "❌ OFFLINE"
                print(f"{name.upper():<10} : {status} ({self.agents[name].model_id})")

    def execute_task(self, task_description: str):
        # 1. Plan (DeepSeek)
        planner = self.agents["deepseek"] if self.agents["deepseek"].alive else self.agents["glm"]
        
        print(f"\n=== STEP 1: Planning with {planner.name} ===")
        plan = planner.query(
             f"Create a detailed implementation plan for: {task_description}. Focus on Next.js best practices.",
             system_role="You are a Senior Architect."
        )
        
        if not plan:
            print("Planning failed.")
            return

        # 2. Implement (Nemotron)
        coder = self.agents["nemotron"]
        if coder.alive:
            print(f"\n=== STEP 2: Implementation with {coder.name} ===")
            code = coder.query(
                f"Implement the following plan:\n{plan}\n\nProvide the full code blocks.",
                system_role="You are an Expert Developer."
            )
        else:
            print("Coder (Nemotron) is offline.")
            return

        # 3. Review (Mistral)
        reviewer = self.agents["mistral"]
        if reviewer.alive:
            print(f"\n=== STEP 3: Review with {reviewer.name} ===")
            reviewer.query(
                f"Review this code for errors, security, and accessibility:\n{code}",
                system_role="You are a QA Engineer."
            )

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("task", nargs="?", help="Task description")
    parser.add_argument("--check", action="store_true", help="Run health check")
    args = parser.parse_args()

    orchestrator = Orchestrator()
    
    if args.check or not args.task:
        orchestrator.health_check()
        
    if args.task:
        orchestrator.execute_task(args.task)

if __name__ == "__main__":
    main()
