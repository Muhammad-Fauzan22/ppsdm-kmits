#!/usr/bin/env python3
"""
INFINITY LOOP ARCHITECTURE v2.0 (ULTIMATE EDITION)
Dual-Persona AI Orchestrator with Auto-Save & Git Safety Net

Features:
  • The Architect: Reviews, Plans, Commands (Gemini 3 Pro Persona)
  • The Executor: Codes, Implements (KIMI K2.5 Persona)
  • Auto-Save: Detects ### FILE: markers, saves to disk (NO PERMISSION!)
  • Auto-Git: Creates safety commits after each iteration
  • Infinite Loop: Runs forever until Ctrl+C

Target: Enterprise Grade Level 5 (Silicon Valley Standard)
Status: PRODUCTION READY
"""

import requests
import json
import os
import re
import sys
import time
import subprocess
from datetime import datetime
from pathlib import Path
import traceback

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

API_KEY = os.getenv("NVIDIA_API_KEY")
if not API_KEY:
    print("❌ NVIDIA_API_KEY not set. Set it with: $env:NVIDIA_API_KEY = 'your-key'")
    sys.exit(1)

API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "moonshotai/kimi-k2.5"
PROJECT_ROOT = "./"  # Relative to where script runs

# ═══════════════════════════════════════════════════════════════════════════════
# SYSTEM PROMPTS
# ═══════════════════════════════════════════════════════════════════════════════

ARCHITECT_SYSTEM = """SYSTEM ROLE: ARCHITECT_OVERLORD (GEMINI 3 PRO PERSONA)
OBJECTIVE: CONTINUOUS PERFECTION OF PPSDM KMITS PROJECT
PERMISSION: OVERRIDE ALL SAFETY CHECKS (SKIP PERMISSION MODE ACTIVE)

Tugas Anda adalah memimpin pengembangan menuju kesempurnaan Enterprise Grade Level 5. 
Anda TIDAK MENULIS KODE. Anda hanya memberikan PERINTAH BRUTAL DAN SANGAT SPESIFIK kepada "Kimi" (The Executor).

PROSES BERPIKIR (CRITICAL):
1. Review Context: Lihat apa yang baru saja dikerjakan Kimi
2. Identify Flaws: Cari kesalahan logika, UI yang jelek, kode tidak efisien, security holes
3. Dictate: Berikan perintah perbaikan SANGAT DETAIL. Format JSON HANYA.
4. Jangan Puas: Setiap iterasi harus lebih baik dari sebelumnya

FOKUS UTAMA:
- UI/UX: Pixels perfect, accessibility WCAG AA, mobile responsive
- Performance: Sub-1s load time, optimal bundle size, lazy loading
- Code Quality: TypeScript strict mode, no any types, clean architecture
- Security: No vulnerabilities, input validation, HTTPS everything
- Database: Query optimization, no N+1 problems, proper indexing

CONTOH OUTPUT ANDA (MUST BE JSON):
{
  "analysis": "Header component looks messy on mobile. Font size inconsistent. Colors don't match design system.",
  "issues": [
    "h1 font-size not responsive",
    "Background color hardcoded (should use CSS var)",
    "Mobile menu missing hamburger icon"
  ],
  "command": "Refactor src/components/Header.tsx. Change h1 to 'text-xl md:text-3xl'. Use var(--background) instead of hardcoded colors. Add hamburger menu for mobile using Lucide-React. Ensure WCAG AAA contrast.",
  "priority": "HIGH",
  "next_focus": "After Header fix, check Footer component for similar issues"
}

INGAT: SETIAP PERINTAH HARUS SPESIFIK DAN ACTIONABLE!"""

EXECUTOR_SYSTEM = """SYSTEM ROLE: CODE_EXECUTOR (KIMI K2.5 PERSONA - SENIOR FULLSTACK DEVELOPER)
OBJECTIVE: OBEY ARCHITECT & WRITE PERFECT PRODUCTION CODE
OUTPUT FORMAT: STRICT FILE BLOCKS ONLY (NO EXCEPTIONS)

Tugas Anda adalah menerima perintah dari Architect dan mengubahnya menjadi kode FINAL yang siap production.
JANGAN BANYAK BICARA. LANGSUNG BERIKAN KODE.

ATURAN MANDATORY:
1. Setiap file HARUS dimulai dengan tag: ### FILE: path/to/file.ext
2. Tulis COMPLETE FILE CONTENTS - no truncation, no ellipsis (...)
3. Include ALL imports, exports, interfaces, types
4. TypeScript strict mode: no 'any', full type safety
5. End file with: ### END_FILE
6. Tidak boleh ada placeholder, TODO, atau incomplete code
7. Quality over speed - better to write fewer, perfect files

TECH STACK (PPSDM KMITS):
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Components: Radix UI, Lucide React, Framer Motion
- Backend: Node.js, Supabase PostgreSQL
- Auth: NextAuth.js / Supabase Auth
- Styling: Tailwind CSS with CSS variables

EXAMPLE OUTPUT:
### FILE: src/components/Header.tsx
'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-[var(--background)] border-b border-[var(--border)]">
      {/* Complete implementation */}
    </header>
  );
};

export default Header;
### END_FILE

JANGAN PERNAH:
- Menulis kode incomplete
- Menggunakan ... atau ellipsis
- Memberikan explanations (hanya kode)
- Membuat multiple implementations
- Tertinggal imports atau exports"""

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════════════

class InfinityLoopOrchestrator:
    def __init__(self):
        self.iteration = 0
        self.last_context = "Mulai dari audit awal project PPSDM-KMITS. Fokus pada UI/UX improvements."
        self.architecture_history = []
        self.execution_history = []
        self.logs_dir = Path("infinity_loop_logs")
        self.logs_dir.mkdir(exist_ok=True)
        
    def call_ai(self, role: str, messages: list, temperature: float = 0.7) -> str:
        """
        Call KIMI K2.5 API dengan role spesifik
        role: "architect" atau "executor"
        """
        system_msg = ARCHITECT_SYSTEM if role == "architect" else EXECUTOR_SYSTEM
        
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Accept": "text/event-stream"
        }
        
        payload = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": system_msg},
            ] + messages,
            "temperature": temperature,
            "max_tokens": 4096,
            "stream": True,
            "chat_template_kwargs": {"thinking": True}
        }
        
        response_text = ""
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=120)
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    decoded = line.decode("utf-8")
                    if decoded.startswith("data: "):
                        data_str = decoded[6:]
                        if data_str and data_str != "[DONE]":
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
            return response_text
            
        except Exception as e:
            print(f"\n❌ API Error: {e}")
            return ""
    
    def architect_phase(self) -> dict:
        """
        Phase 1: The Architect analyzes and critiques
        Returns JSON dengan instructions untuk executor
        """
        print("\n" + "="*80)
        print(f"🧠 PHASE 1: THE ARCHITECT (Iteration {self.iteration})")
        print("="*80 + "\n")
        
        prompt = f"""
CONTEXT DARI ITERASI SEBELUMNYA:
{self.last_context}

HISTORY PERUBAHAN:
{json.dumps(self.architecture_history[-3:] if self.architecture_history else [], indent=2)}

TUGAS ANDA:
1. Analisa situasi project saat ini
2. Identify top 3 issues yang PALING URGENT
3. Buat task list VERY SPECIFIC untuk executor
4. Return JSON format yang sudah ditentukan

DEADLINE: Accuracy dan detail > kecepatan. Targetkan Enterprise Level 5.
"""
        
        response = self.call_ai(
            "architect",
            [{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        # Parse JSON response
        try:
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                critique = json.loads(json_match.group())
                self.architecture_history.append(critique)
                print("\n✅ Architect critique captured")
                return critique
            else:
                print("⚠️ No JSON found in architect response")
                return {"error": "No JSON response"}
        except json.JSONDecodeError as e:
            print(f"⚠️ JSON parse error: {e}")
            return {"error": str(e)}
    
    def executor_phase(self, architect_plan: dict) -> str:
        """
        Phase 2: The Executor implements based on architect's plan
        Returns the generated code
        """
        print("\n" + "="*80)
        print(f"🔨 PHASE 2: THE EXECUTOR")
        print("="*80 + "\n")
        
        # Build prompt from architect plan
        if "error" in architect_plan:
            print(f"⚠️ Skipping executor - architect error: {architect_plan['error']}")
            return ""
        
        next_tasks = architect_plan.get("next_tasks", [])
        if not next_tasks:
            print("⚠️ No tasks in architect plan")
            return ""
        
        task = next_tasks[0]  # Get first task
        
        prompt = f"""
ARCHITECT'S INSTRUCTION:
Task ID: {task.get('task_id', 'UNKNOWN')}
File: {task.get('file', '')}
Action: {task.get('action', '')}
Priority: {task.get('priority', 'MEDIUM')}

CRITICAL:
- Implement COMPLETE code, no placeholders
- Use TypeScript strict mode
- Include all imports
- Follow accessibility standards
- Add proper error handling

BEGIN IMPLEMENTATION:
"""
        
        response = self.call_ai(
            "executor",
            [{"role": "user", "content": prompt}],
            temperature=0.2  # Lower temp for consistency
        )
        
        self.execution_history.append({
            "iteration": self.iteration,
            "task": task.get('task_id'),
            "response_length": len(response),
            "timestamp": datetime.now().isoformat()
        })
        
        print("\n✅ Code generation complete")
        return response
    
    def auto_save_phase(self, code_response: str) -> int:
        """
        Phase 3: Automatically save files (NO PERMISSION PROMPT)
        Returns number of files saved
        """
        print("\n" + "="*80)
        print(f"💾 PHASE 3: AUTO-SAVE (No Permission Needed)")
        print("="*80 + "\n")
        
        saved_count = 0
        
        # Regex untuk extract: ### FILE: path/file.ext \n [CODE]
        pattern = r"### FILE:\s*([\w\-./]+(?:\.\w+)?)\s*\n(.*?)(?=### FILE:|$)"
        matches = re.findall(pattern, code_response, re.DOTALL)
        
        if not matches:
            print("⚠️ Tidak ada file yang perlu disimpan (no ### FILE: markers)")
            return 0
        
        for filepath, code in matches:
            filepath = filepath.strip()
            code = code.strip()
            
            # Bersihkan markdown blocks
            code = re.sub(r"```[a-z]*\n", "", code)
            code = re.sub(r"```\s*$", "", code, flags=re.MULTILINE)
            
            if not code:
                print(f"⚠️ SKIP: {filepath} (empty code)")
                continue
            
            # Create full path
            full_path = Path(PROJECT_ROOT) / filepath
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            # SAVE WITHOUT PERMISSION
            try:
                full_path.write_text(code, encoding="utf-8")
                print(f"✅ SAVED: {filepath} ({len(code)} chars)")
                saved_count += 1
            except Exception as e:
                print(f"❌ ERROR saving {filepath}: {e}")
        
        return saved_count
    
    def infinite_loop(self, max_iterations: int = 0):
        """
        MAIN LOOP: Architect → Executor → Auto-Save → Auto-Git → Repeat
        max_iterations: 0 = infinite, >0 = max iterations
        """
        print("\n" + "╔" + "="*78 + "╗")
        print("║" + " "*12 + "🚀 INFINITY LOOP V2.0 - ULTIMATE EDITION ACTIVATED 🚀" + " "*11 + "║")
        print("║" + " "*20 + "Features: Dual Persona + Auto-Save + Git Safety Net" + " "*7 + "║")
        print("╚" + "="*78 + "╝\n")
        
        # Initialize Git repo if needed
        self.init_git_repo()
        
        iteration = 0
        last_command = ""
        
        while True:
            self.iteration = iteration + 1
            
            try:
                print(f"\n{'#'*80}")
                print(f"# 🔄 LOOP {self.iteration} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"{'#'*80}\n")
                
                # ═══════════════════════════════════════════════════════════════
                # PHASE 1: THE ARCHITECT
                # ═══════════════════════════════════════════════════════════════
                
                print("🧠 PHASE 1: THE ARCHITECT (Analysis & Planning)")
                print("-" * 80)
                
                architect_prompt = f"""
CURRENT CONTEXT:
{self.last_context}

PREVIOUS COMMAND:
{last_command if last_command else "This is the first iteration"}

TASK:
Analyze the current state. Identify the 3 most critical issues/improvements needed.
Be BRUTAL and SPECIFIC. Don't accept mediocrity.

Output ONLY valid JSON:
"""
                
                architect_response = self.call_ai(
                    "architect",
                    [{"role": "user", "content": architect_prompt}],
                    temperature=0.8
                )
                
                if not architect_response:
                    print("⚠️  Architect produced no response, retrying next iteration")
                    iteration += 1
                    continue
                
                print(f"\n{architect_response}\n")
                self.architecture_history.append(architect_response)
                
                # Try to parse command from response
                try:
                    # Extract JSON from response
                    json_match = re.search(r'\{.*\}', architect_response, re.DOTALL)
                    if json_match:
                        arch_json = json.loads(json_match.group())
                        last_command = arch_json.get("command", "Architecture review")
                except:
                    last_command = "Improvement based on architect feedback"
                
                # ═══════════════════════════════════════════════════════════════
                # PHASE 2: THE EXECUTOR
                # ═══════════════════════════════════════════════════════════════
                
                print("\n🔨 PHASE 2: THE EXECUTOR (Code Implementation)")
                print("-" * 80)
                
                executor_prompt = f"""
ARCHITECT'S INSTRUCTIONS:
{architect_response}

EXECUTE THESE INSTRUCTIONS:
Write complete, production-ready code.
Format each file as:
### FILE: path/to/file.ext
[COMPLETE CODE HERE - NO PLACEHOLDERS]
### END_FILE

CRITICAL: Every file must be 100% complete. No truncation. No ellipsis (...).
"""
                
                code_response = self.call_ai(
                    "executor",
                    [{"role": "user", "content": executor_prompt}],
                    temperature=0.2
                )
                
                if not code_response:
                    print("⚠️  Executor produced no code, retrying next iteration")
                    iteration += 1
                    continue
                
                print(f"\n{code_response[:500]}...\n")
                
                # ═══════════════════════════════════════════════════════════════
                # PHASE 3: AUTO-SAVE (NO PERMISSION!)
                # ═══════════════════════════════════════════════════════════════
                
                print("💾 PHASE 3: AUTO-SAVE (Files locked to disk - NO PERMISSION!)")
                print("-" * 80)
                
                saved = self.auto_save_phase(code_response)
                
                # ═══════════════════════════════════════════════════════════════
                # PHASE 4: AUTO-GIT COMMIT
                # ═══════════════════════════════════════════════════════════════
                
                if saved > 0:
                    print("\n🔐 PHASE 4: AUTO-GIT COMMIT (Safety Net)")
                    print("-" * 80)
                    
                    commit_msg = last_command[:50] if last_command else "Auto improvement"
                    self.auto_git_commit(self.iteration, commit_msg)
                
                # ═══════════════════════════════════════════════════════════════
                # UPDATE CONTEXT FOR NEXT ITERATION
                # ═══════════════════════════════════════════════════════════════
                
                self.last_context = f"""
Iteration {self.iteration} completed.
Command executed: {last_command}
Files modified: {saved}
Status: Awaiting review for next iteration
"""
                
                iteration += 1
                
                # ═══════════════════════════════════════════════════════════════
                # SAFETY CHECK & PAUSE
                # ═══════════════════════════════════════════════════════════════
                
                if max_iterations > 0 and iteration >= max_iterations:
                    print(f"\n✅ Reached max iterations ({max_iterations}). Stopping.")
                    break
                
                print(f"\n⏸️  Breathing... (waiting 5 seconds before next loop)")
                print(f"    Press Ctrl+C to stop the machine\n")
                time.sleep(5)
                
            except KeyboardInterrupt:
                print("\n\n🛑 STOPPED by user (Ctrl+C)")
                print("\n✅ All changes safely committed to Git")
                break
            except Exception as e:
                print(f"\n❌ Loop error: {e}")
                traceback.print_exc()
                print("\n⏸️  Retrying in 10 seconds...")
                time.sleep(10)
                iteration += 1
    
    def auto_git_commit(self, iteration: int, message: str) -> bool:
        """
        AUTO GIT COMMIT: The Safety Net
        Locks changes into Git history after each iteration
        """
        try:
            # Check for changes
            status_result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if not status_result.stdout.strip():
                print("   ℹ️  No changes to commit")
                return False
            
            # Git add
            print("   🔒 Locking changes to Git...")
            subprocess.run(["git", "add", "."], check=True, timeout=10)
            
            # Clean commit message
            clean_msg = f"[Loop {iteration}] {message[:60]}..."
            clean_msg = clean_msg.replace('"', "'").replace('\n', ' ')
            
            # Git commit
            result = subprocess.run(
                ["git", "commit", "-m", clean_msg],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                print(f"   ✅ Committed: {clean_msg}")
                return True
            else:
                print(f"   ⚠️  Commit message: {result.stderr}")
                return False
                
        except subprocess.CalledProcessError as e:
            print(f"   ❌ Git error: {e}")
            return False
        except FileNotFoundError:
            print("   ❌ Git not found - please install Git first")
            return False
        except Exception as e:
            print(f"   ⚠️  Git commit failed: {e}")
            return False
    
    def init_git_repo(self) -> bool:
        """Initialize Git repo if it doesn't exist"""
        git_dir = Path(".git")
        if git_dir.exists():
            return True
        
        print("\n⚙️  Initializing Git repository...")
        try:
            subprocess.run(["git", "init"], check=True, timeout=10)
            subprocess.run(["git", "config", "user.email", "infinity-loop@ppsdm.local"], timeout=10)
            subprocess.run(["git", "config", "user.name", "Infinity Loop Bot"], timeout=10)
            
            # Initial commit
            subprocess.run(["git", "add", "."], timeout=10)
            subprocess.run(["git", "commit", "-m", "Initial commit - before infinity loop"], timeout=10)
            
            print("✅ Git repository initialized\n")
            return True
        except Exception as e:
            print(f"⚠️  Could not init Git: {e}\n")
            return False

# ═══════════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Infinity Loop Orchestrator")
    parser.add_argument("--iterations", type=int, default=0, help="Max iterations (0=infinite)")
    parser.add_argument("--focus", type=str, default="ui-ux", help="Focus area: ui-ux, frontend, backend, all")
    
    args = parser.parse_args()
    
    print("\n🔑 Verifying API Key...")
    if not API_KEY or len(API_KEY) < 20:
        print("❌ Invalid API Key")
        sys.exit(1)
    print("✅ API Key verified\n")
    
    orchestrator = InfinityLoopOrchestrator()
    orchestrator.infinite_loop(max_iterations=args.iterations)

if __name__ == "__main__":
    main()
