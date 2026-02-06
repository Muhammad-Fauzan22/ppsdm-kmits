#!/usr/bin/env python3
"""
Codebase Audit Script for Next.js 14 + Supabase + Tailwind CSS
Generates comprehensive audit report with HIGH/MEDIUM/LOW priority issues
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

class CodebaseAuditor:
    def __init__(self, project_root=".."):
        self.project_root = Path(project_root)
        self.findings = {
            "high": [],
            "medium": [],
            "low": []
        }
        self.files_scanned = 0
        
    def scan_file(self, file_path):
        """Scan a single file for issues"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
        except Exception as e:
            return
            
        rel_path = str(file_path.relative_to(self.project_root))
        self.files_scanned += 1
        
        # Check 1: Hollow onClick handlers (HIGH)
        if re.search(r'onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}', content):
            self.findings["high"].append({
                "file": rel_path,
                "issue": "Empty onClick handler found",
                "fix": "Add proper handler logic or remove the onClick"
            })
        
        # Check 2: onClick with only console.log (HIGH)
        if re.search(r'onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*console\.log\s*\(', content):
            self.findings["high"].append({
                "file": rel_path,
                "issue": "Hollow onClick with only console.log",
                "fix": "Implement actual functionality instead of console.log"
            })
        
        # Check 3: useState/useEffect without 'use client' in app/ (HIGH)
        if '/app/' in str(file_path) and file_path.suffix in ['.tsx', '.jsx']:
            has_hooks = re.search(r'\b(useState|useEffect|useContext|useReducer)\b', content)
            has_use_client = '"use client"' in content or "'use client'" in content
            if has_hooks and not has_use_client:
                self.findings["high"].append({
                    "file": rel_path,
                    "issue": "React hooks used without 'use client' directive",
                    "fix": "Add 'use client' at the top of the file or refactor to Server Component"
                })
        
        # Check 4: Button used for navigation instead of Link (MEDIUM)
        if re.search(r'<button[^>]*onClick\s*=\s*\{[^}]*router\.push', content):
            self.findings["medium"].append({
                "file": rel_path,
                "issue": "Button used with router.push for navigation",
                "fix": "Replace with Next.js <Link> component for better UX and accessibility"
            })
        
        # Check 5: Hardcoded hex colors (LOW)
        hex_colors = re.findall(r'(?:bg|text|border)-\[#[0-9a-fA-F]{3,8}\]', content)
        if hex_colors:
            self.findings["low"].append({
                "file": rel_path,
                "issue": f"Hardcoded hex colors found: {hex_colors[:3]}",
                "fix": "Use Tailwind CSS variables like bg-primary, text-foreground, border-border"
            })
        
        # Check 6: API routes without try/catch (HIGH)
        if '/api/' in str(file_path) and 'route' in str(file_path):
            if 'try' not in content and 'catch' not in content:
                self.findings["high"].append({
                    "file": rel_path,
                    "issue": "API route without error handling (try/catch)",
                    "fix": "Wrap API logic in try/catch blocks and return proper error responses"
                })
        
        # Check 7: Exposed API keys (HIGH - CRITICAL)
        api_key_patterns = [
            r'sk-[a-zA-Z0-9]{20,}',
            r'nvapi-[a-zA-Z0-9]{20,}',
            r'gsk_[a-zA-Z0-9]{20,}',
            r'eyJhbGciOiJIUzI1NiIsInR5cCI[\w-]*',
        ]
        for pattern in api_key_patterns:
            if re.search(pattern, content) and file_path.name not in ['.env', '.env.local', '.env.example']:
                self.findings["high"].append({
                    "file": rel_path,
                    "issue": "Potential exposed API key detected",
                    "fix": "CRITICAL: Move API keys to .env.local and use process.env.XXX"
                })
                break
        
        # Check 8: Incorrect Supabase client usage (MEDIUM)
        if 'supabase' in content.lower():
            # Check for createClient called in client component without proper handling
            if 'createClient' in content and '/app/' in str(file_path):
                if '"use client"' not in content and 'use client' not in content:
                    # This might be a server component - check if it's using server client
                    if 'server' not in str(file_path).lower():
                        self.findings["medium"].append({
                            "file": rel_path,
                            "issue": "Supabase client usage without proper Server/Client separation",
                            "fix": "Use createClient from @supabase/ssr with proper cookie handling"
                        })
        
        # Check 9: Fixed widths that break mobile (LOW)
        if re.search(r'w-\[\d+px\]|w-\d{3,}px', content):
            self.findings["low"].append({
                "file": rel_path,
                "issue": "Fixed pixel widths found that may break on mobile",
                "fix": "Use responsive widths (w-full, max-w-md, etc.) or relative units"
            })
        
        # Check 10: Dark mode issues (MEDIUM)
        if 'bg-white' in content or 'text-black' in content:
            self.findings["medium"].append({
                "file": rel_path,
                "issue": "Hardcoded bg-white or text-black may break dark mode",
                "fix": "Use bg-background and text-foreground for theme compatibility"
            })
    
    def scan_project(self):
        """Scan the entire project"""
        print("🔍 Starting codebase audit...")
        print(f"📁 Project root: {self.project_root.absolute()}")
        
        # Scan src directory
        src_dir = self.project_root / 'src'
        if src_dir.exists():
            for root, dirs, files in os.walk(src_dir):
                # Skip node_modules
                if 'node_modules' in str(root):
                    continue
                    
                for file in files:
                    if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                        self.scan_file(Path(root) / file)
        
        # Scan app directory at root
        app_dir = self.project_root / 'app'
        if app_dir.exists():
            for root, dirs, files in os.walk(app_dir):
                if 'node_modules' in str(root):
                    continue
                for file in files:
                    if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                        self.scan_file(Path(root) / file)
        
        print(f"✅ Scanned {self.files_scanned} files")
        
    def generate_report(self):
        """Generate comprehensive audit report"""
        report = []
        report.append("# 🔍 CODEBASE AUDIT REPORT")
        report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"**Files Scanned:** {self.files_scanned}")
        report.append(f"**Total Issues:** {len(self.findings['high']) + len(self.findings['medium']) + len(self.findings['low'])}")
        report.append("")
        
        # HIGH PRIORITY
        report.append("## 🔴 HIGH PRIORITY (App Breaking / Security Risk)")
        if self.findings['high']:
            for i, finding in enumerate(self.findings['high'], 1):
                report.append(f"\n### {i}. {finding['issue']}")
                report.append(f"- **File:** `{finding['file']}`")
                report.append(f"- **Fix:** {finding['fix']}")
        else:
            report.append("\n✅ No high priority issues found!")
        
        # MEDIUM PRIORITY
        report.append("\n## 🟠 MEDIUM PRIORITY (UX / Functionality)")
        if self.findings['medium']:
            for i, finding in enumerate(self.findings['medium'], 1):
                report.append(f"\n### {i}. {finding['issue']}")
                report.append(f"- **File:** `{finding['file']}`")
                report.append(f"- **Fix:** {finding['fix']}")
        else:
            report.append("\n✅ No medium priority issues found!")
        
        # LOW PRIORITY
        report.append("\n## 🟡 LOW PRIORITY (Styling / Best Practices)")
        if self.findings['low']:
            for i, finding in enumerate(self.findings['low'], 1):
                report.append(f"\n### {i}. {finding['issue']}")
                report.append(f"- **File:** `{finding['file']}`")
                report.append(f"- **Fix:** {finding['fix']}")
        else:
            report.append("\n✅ No low priority issues found!")
        
        # Summary
        report.append("\n---")
        report.append("\n## 📊 Summary")
        report.append(f"- 🔴 High: {len(self.findings['high'])}")
        report.append(f"- 🟠 Medium: {len(self.findings['medium'])}")
        report.append(f"- 🟡 Low: {len(self.findings['low'])}")
        
        return '\n'.join(report)
    
    def save_report(self, filename="AUDIT_REPORT.md"):
        """Save report to file"""
        report = self.generate_report()
        output_path = self.project_root / filename
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"\n📝 Report saved to: {output_path}")
        return output_path

if __name__ == "__main__":
    auditor = CodebaseAuditor()
    auditor.scan_project()
    auditor.save_report()
    print(auditor.generate_report())
