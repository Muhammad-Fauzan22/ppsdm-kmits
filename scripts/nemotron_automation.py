#!/usr/bin/env python3
"""
Nemotron Automation Orchestrator
Adapts the Kimi workflow to use nvidia/nemotron-3-nano-30b-a3b
"""

import os
import sys
import json
import time
from datetime import datetime
from typing import Optional

# Force UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from openai import OpenAI
except ImportError:
    print("Error: 'openai' package not installed. Run 'pip install openai'")
    sys.exit(1)

class NemotronAutomation:
    def __init__(self, api_key: Optional[str] = None):
        # Use provided key or fallback to env, but prioritize the specific one given by user
        self.api_key = api_key or "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"
        
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=self.api_key
        )
        self.model = "nvidia/nemotron-3-nano-30b-a3b"
        self.max_tokens = 8192 # As per user request
        self.iteration_count = 0
        self.session_log = []
        
    def call_model(self, prompt: str) -> str:
        """Call Nemotron with streaming support"""
        print("\n" + "="*80)
        print(f"🔄 ITERATION #{self.iteration_count + 1}")
        print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80)
        print("\n🤖 Nemotron Processing...\n")
        
        response_text = ""
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=1,
                top_p=1,
                max_tokens=self.max_tokens,
                extra_body={"reasoning_budget": 16384, "chat_template_kwargs": {"enable_thinking": True}},
                stream=True
            )
            
            for chunk in completion:
                if not chunk.choices:
                    continue
                
                # Check for reasoning content
                reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
                if reasoning:
                    print(reasoning, end="", flush=True)
                    # We might want to capture reasoning too, but for now append to response or just display it
                    
                # Check for actual content
                content = chunk.choices[0].delta.content
                if content:
                    print(content, end="", flush=True)
                    response_text += content
            
            print("\n")
            self.iteration_count += 1
            self.session_log.append({
                "iteration": self.iteration_count,
                "timestamp": datetime.now().isoformat(),
                "prompt_preview": prompt[:100] + "..." if len(prompt) > 100 else prompt,
                "response_length": len(response_text)
            })
            
            return response_text
            
        except Exception as e:
            print(f"❌ Error calling Nemotron: {e}")
            return ""
    
    def analyze_project(self) -> str:
        """Initial project analysis"""
        prompt = """Analyze the PPSDM-KMITS project structure and provide:
1. Current architecture overview
2. Top 5 priority areas for improvement (UI/UX, Frontend, Backend)
3. Specific actionable suggestions for each area
4. Risk assessment for current implementation

Be specific and cite actual file paths or technologies found in this Next.js project."""
        
        return self.call_model(prompt)
    
    def generate_improvement_tasks(self, analysis_result: str) -> str:
        """Generate specific improvement tasks based on analysis"""
        prompt = f"""Based on this project analysis:
{analysis_result}

Please provide:
1. Detailed implementation roadmap for the TOP 3 improvements
2. For each task, specify:
   - Component/File paths to modify
   - Specific code changes needed
   - Testing approach
   - Estimated complexity
3. Quick wins (<1 hour)

Format as actionable engineering tasks."""
        
        return self.call_model(prompt)

    def run_improvement_loop(self, iterations: int = 3):
        """Run the continuous improvement loop"""
        print(f"\n🚀 Starting Nemotron Automation Loop ({iterations} iterations)")
        
        try:
            # Phase 1: Analysis
            print("\n" + "🔍 PHASE 1: PROJECT ANALYSIS" + "\n")
            analysis = self.analyze_project()
            if not analysis: return False
            
            # Phase 2: Generate Tasks
            print("\n" + "📋 PHASE 2: IMPROVEMENT TASKS GENERATION" + "\n")
            tasks = self.generate_improvement_tasks(analysis)
            
            # Save results
            self.save_iteration_result(1, analysis, tasks)
            
        except Exception as e:
            print(f"\n❌ Automation error: {e}")
            return False
            
        return True

    def save_iteration_result(self, iteration: int, *results):
        """Save iteration results to file"""
        output_dir = "kimi_automation_logs" # Keep same dir for consistency
        os.makedirs(output_dir, exist_ok=True)
        
        log_file = f"{output_dir}/nemotron_iteration_{iteration}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump({
                "iteration": iteration,
                "timestamp": datetime.now().isoformat(),
                "analysis": results[0] if results else "",
                "tasks": results[1] if len(results) > 1 else "",
            }, f, indent=2, ensure_ascii=False)
            
def main():
    if len(sys.argv) < 2:
        iterations = 1
    else:
        iterations = int(sys.argv[1])
        
    automation = NemotronAutomation()
    automation.run_improvement_loop(iterations)

if __name__ == "__main__":
    main()
