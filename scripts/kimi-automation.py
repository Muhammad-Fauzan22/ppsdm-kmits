#!/usr/bin/env python3
"""
KIMI K2.5 Automation Orchestrator
Provides looping automation to continuously improve PPSDM-KMITS project
"""

import os
import sys
import json
import subprocess
import time
from datetime import datetime
from typing import Optional
import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')


class KimiAutomation:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("NVIDIA_API_KEY")
        if not self.api_key:
            raise ValueError("NVIDIA_API_KEY not set in environment or provided")
        
        self.invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "moonshotai/kimi-k2.5"
        self.max_tokens = 16384
        self.iteration_count = 0
        self.session_log = []
        
    def call_kimi(self, prompt: str, thinking: bool = True) -> str:
        """Call KIMI K2.5 with streaming support"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "text/event-stream"
        }
        
        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": self.max_tokens,
            "temperature": 1.0,
            "top_p": 1.0,
            "stream": True,
            "chat_template_kwargs": {"thinking": thinking},
        }
        
        print("\n" + "="*80)
        print(f"🔄 ITERATION #{self.iteration_count + 1}")
        print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80)
        print("\n🤖 KIMI K2.5 Processing...\n")
        
        response_text = ""
        try:
            response = requests.post(self.invoke_url, headers=headers, json=payload)
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    decoded = line.decode("utf-8")
                    if decoded.startswith("data: "):
                        data_str = decoded[6:]
                        if data_str:
                            try:
                                data = json.loads(data_str)
                                if "choices" in data and data["choices"]:
                                    delta = data["choices"][0].get("delta", {})
                                    content = delta.get("content", "")
                                    if content:
                                        response_text += content
                                        print(content, end="", flush=True)
                            except json.JSONDecodeError:
                                pass
            
            print("\n")
            self.iteration_count += 1
            self.session_log.append({
                "iteration": self.iteration_count,
                "timestamp": datetime.now().isoformat(),
                "prompt_preview": prompt[:100] + "..." if len(prompt) > 100 else prompt,
                "response_length": len(response_text)
            })
            
            return response_text
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error calling KIMI: {e}")
            return ""
    
    def analyze_project(self) -> str:
        """Initial project analysis"""
        prompt = """Analyze the PPSDM-KMITS project structure and provide:
1. Current architecture overview
2. Key strengths in the codebase
3. Top 5 priority areas for improvement (UI/UX, Frontend, Backend)
4. Specific actionable suggestions for each area
5. Risk assessment for current implementation

Be specific and cite actual file paths or technologies found."""
        
        return self.call_kimi(prompt)
    
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
   - Estimated complexity (Low/Medium/High)
3. Dependencies between tasks
4. Quick wins (can be done in <1 hour)

Format as actionable engineering tasks, not general advice."""
        
        return self.call_kimi(prompt)
    
    def code_review_task(self, task_description: str) -> str:
        """Review and critique proposed implementation"""
        prompt = f"""As a senior code reviewer, evaluate this implementation task:
{task_description}

Provide:
1. Code quality assessment
2. Performance considerations
3. Security implications
4. Best practices alignment
5. Specific refactoring suggestions
6. Testing checklist

Be critical and provide exact code examples where improvements are needed."""
        
        return self.call_kimi(prompt)
    
    def implementation_guidance(self, tech_stack: str, task: str) -> str:
        """Provide implementation guidance for specific task"""
        prompt = f"""Provide detailed implementation guidance for:

Task: {task}
Tech Stack: {tech_stack}

Include:
1. Step-by-step implementation guide
2. Code snippets for critical sections
3. Common pitfalls to avoid
4. Integration points with existing code
5. Testing strategy
6. Performance optimization tips

Make this production-ready code."""
        
        return self.call_kimi(prompt)
    
    def run_improvement_loop(self, iterations: int = 3):
        """Run the continuous improvement loop"""
        print(f"\n🚀 Starting KIMI Automation Loop ({iterations} iterations)")
        print(f"📊 Project: PPSDM-KMITS")
        print(f"⏱️  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        try:
            # Phase 1: Analysis
            print("\n" + "🔍 PHASE 1: PROJECT ANALYSIS" + "\n")
            analysis = self.analyze_project()
            
            # Phase 2: Generate Tasks
            print("\n" + "📋 PHASE 2: IMPROVEMENT TASKS GENERATION" + "\n")
            tasks = self.generate_improvement_tasks(analysis)
            
            # Phase 3: Loop through iterations
            for i in range(iterations):
                print(f"\n{'='*80}")
                print(f"🔄 IMPROVEMENT ITERATION {i+1}/{iterations}")
                print(f"{'='*80}\n")
                
                # Get code review
                review = self.code_review_task(tasks)
                
                # Get implementation guidance
                implementation = self.implementation_guidance(
                    "Next.js, TypeScript, Tailwind CSS, Supabase, React",
                    tasks
                )
                
                # Ask for next steps
                next_steps = self.ask_next_steps(review, implementation)
                
                # Save iteration result
                self.save_iteration_result(i+1, analysis, tasks, review, implementation, next_steps)
                
                # Small delay between iterations
                if i < iterations - 1:
                    print("\n⏳ Preparing next iteration...")
                    time.sleep(2)
        
        except Exception as e:
            print(f"\n❌ Automation error: {e}")
            return False
        
        finally:
            self.print_session_summary()
        
        return True
    
    def ask_next_steps(self, review: str, implementation: str) -> str:
        """Ask KIMI for next steps after each iteration"""
        prompt = f"""Based on this code review and implementation guidance:

REVIEW:
{review[:500]}...

IMPLEMENTATION:
{implementation[:500]}...

What are the NEXT 3 IMMEDIATE STEPS to continue improving this project?
Prioritize by impact and feasibility."""
        
        return self.call_kimi(prompt)
    
    def save_iteration_result(self, iteration: int, *results):
        """Save iteration results to file"""
        output_dir = "kimi_automation_logs"
        os.makedirs(output_dir, exist_ok=True)
        
        log_file = f"{output_dir}/iteration_{iteration}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump({
                "iteration": iteration,
                "timestamp": datetime.now().isoformat(),
                "analysis": results[0][:1000] if results else "",
                "tasks": results[1][:1000] if len(results) > 1 else "",
                "review": results[2][:1000] if len(results) > 2 else "",
                "implementation": results[3][:1000] if len(results) > 3 else "",
                "next_steps": results[4][:1000] if len(results) > 4 else "",
            }, f, indent=2, ensure_ascii=False)
    
    def print_session_summary(self):
        """Print session summary"""
        print("\n" + "="*80)
        print("📊 SESSION SUMMARY")
        print("="*80)
        print(f"Total iterations: {len(self.session_log)}")
        for log in self.session_log:
            print(f"  • Iteration {log['iteration']}: {log['timestamp']}")
            print(f"    Response length: {log['response_length']} chars")
        print(f"\n📁 Logs saved to: kimi_automation_logs/")
        print("="*80 + "\n")


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python kimi-automation.py <iterations> [api_key]")
        print("Example: python kimi-automation.py 3")
        sys.exit(1)
    
    iterations = int(sys.argv[1]) if sys.argv[1].isdigit() else 3
    api_key = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        automation = KimiAutomation(api_key)
        success = automation.run_improvement_loop(iterations)
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
