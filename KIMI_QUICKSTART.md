# KIMI K2.5 Automation - Quick Start Guide

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- `requests` library: `pip install requests`
- NVIDIA API Key untuk KIMI K2.5

### 2. Get NVIDIA API Key
1. Pergi ke https://build.nvidia.com/
2. Sign up atau login dengan akun Anda
3. Dapatkan API Key untuk "moonshotai/kimi-k2.5"
4. Set environment variable:

**Windows (PowerShell):**
```powershell
$env:NVIDIA_API_KEY = "your-api-key-here"
```

**Windows (Command Prompt):**
```cmd
set NVIDIA_API_KEY=your-api-key-here
```

**Linux/Mac:**
```bash
export NVIDIA_API_KEY="your-api-key-here"
```

### 3. Install Dependencies
```bash
pip install requests
```

### 4. Run Automation

#### Option A: Python Direct
```bash
# Single iteration (analysis only)
python scripts/kimi-automation.py 1

# 3 iterations (full improvement loop)
python scripts/kimi-automation.py 3

# With custom API key
python scripts/kimi-automation.py 3 "your-api-key"
```

#### Option B: PowerShell Script (recommended for Windows)
```powershell
# See start-kimi.ps1 for easy wrapper
.\scripts\start-kimi.ps1 -iterations 3
```

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    KIMI AUTOMATION LOOP                     │
└─────────────────────────────────────────────────────────────┘

1. 🔍 ANALYSIS PHASE
   └─> KIMI analyzes project structure
   └─> Identifies top 5 improvements
   └─> Creates priority matrix

2. 📋 ROADMAP GENERATION
   └─> Detailed tasks created
   └─> Effort/impact assessed
   └─> Dependencies mapped

3. 🔄 ITERATION LOOP (repeats 3-5x)
   ├─> CODE REVIEW
   │   └─> Quality checklist
   │   └─> Security analysis
   │   └─> Performance check
   │
   ├─> IMPLEMENTATION GUIDANCE
   │   └─> Step-by-step instructions
   │   └─> Code examples
   │   └─> Integration points
   │
   ├─> NEXT STEPS PLANNING
   │   └─> Immediate actions
   │   └─> Blockers identification
   │   └─> Metrics to track
   │
   └─> SAVE RESULTS
       └─> JSON logs
       └─> Iteration tracking

4. 📊 SESSION SUMMARY
   └─> Total work completed
   └─> Files modified
   └─> Next recommendations
```

---

## Output Structure

All KIMI responses saved to: `kimi_automation_logs/`

```
kimi_automation_logs/
├─ iteration_1_20260131_120000.json
│  ├─ analysis: Project analysis output
│  ├─ tasks: Generated improvement tasks
│  ├─ review: Code review feedback
│  ├─ implementation: Detailed guidance
│  └─ next_steps: Next iteration tasks
│
├─ iteration_2_20260131_120500.json
│
└─ session_summary.txt
```

---

## Using KIMI Responses

### Step 1: Review Analysis
```bash
cat kimi_automation_logs/iteration_1_*.json | python -m json.tool | grep -A 50 '"analysis"'
```

### Step 2: Pick Task to Implement
- Review the generated tasks
- Sort by impact/effort ratio
- Start with quick wins (P0 + Low complexity)

### Step 3: Follow Implementation Guidance
- Copy code examples from KIMI
- Follow step-by-step checklist
- Test as you go

### Step 4: Code Review Checklist
- Use KIMI's review criteria
- Verify all points checked
- Run tests before committing

### Step 5: Next Iteration
- After implementation complete
- Run next iteration
- KIMI suggests next steps

---

## Example Workflow

### Day 1: Initial Analysis
```powershell
python scripts/kimi-automation.py 1
# Review analysis + generated tasks
# Implement 1-2 quick wins
```

### Day 2: Deep Improvements
```powershell
python scripts/kimi-automation.py 3
# Implement UI/UX improvements
# Refactor frontend components
# Optimize database queries
```

### Day 3: Quality & Polish
```powershell
python scripts/kimi-automation.py 2
# Security review
# Performance optimization
# Final polish
```

---

## Environment Variables

Create `.env.local` file (or set system variables):

```env
# Required
NVIDIA_API_KEY=sk-xxxxx

# Optional
KIMI_MAX_TOKENS=16384
KIMI_TEMPERATURE=1.0
KIMI_TOP_P=1.0
KIMI_THINKING=true
```

---

## Troubleshooting

### API Key Issues
```powershell
# Verify API key is set
echo $env:NVIDIA_API_KEY

# Test connection
python -c "
import os
import requests
api_key = os.getenv('NVIDIA_API_KEY')
headers = {'Authorization': f'Bearer {api_key}'}
print(f'API Key found: {bool(api_key)}')
print(f'Key preview: {api_key[:10]}...' if api_key else 'No key')
"
```

### Python Dependencies
```powershell
# Install required packages
pip install requests python-dotenv

# Verify installation
python -c "import requests; print(f'requests version: {requests.__version__}')"
```

### API Rate Limits
- If rate limited, wait 60 seconds before retry
- KIMI K2.5 has generous limits for authenticated users
- Check NVIDIA docs for current limits

### Log Review
```powershell
# View latest iteration
$latest = Get-ChildItem kimi_automation_logs | Sort-Object -Desc -Property LastWriteTime | Select-Object -First 1
Get-Content $latest.FullName | ConvertFrom-Json | Format-List
```

---

## Integration with Development Workflow

### Git Integration
```bash
# After KIMI suggests improvements, create feature branch
git checkout -b feature/kimi-improvement-$(date +%s)

# Implement changes from KIMI guidance
# ... make edits ...

# Test thoroughly
npm test
npm run lint

# Commit with clear message
git commit -m "feat: [KIMI] improvement for [task-id]"

# Create PR for review
git push origin feature/kimi-improvement-...
```

### CI/CD Integration
Add to `.github/workflows/` or your CI system:
```yaml
name: KIMI Automation Check
on: [workflow_dispatch]
jobs:
  kimi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run KIMI Analysis
        env:
          NVIDIA_API_KEY: ${{ secrets.NVIDIA_API_KEY }}
        run: python scripts/kimi-automation.py 1
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: kimi-logs
          path: kimi_automation_logs/
```

---

## Performance Expectations

| Iterations | Estimated Time | Output Size |
|-----------|-----------------|------------|
| 1 (analysis only) | 2-3 minutes | 5-10 KB |
| 3 (standard) | 10-15 minutes | 30-50 KB |
| 5 (deep) | 20-30 minutes | 50-100 KB |

---

## Success Metrics

After running KIMI automation:

- [ ] Project analysis completed
- [ ] Top improvements identified
- [ ] Actionable tasks generated
- [ ] Code review completed
- [ ] Implementation guidance provided
- [ ] Logs saved and reviewed
- [ ] Next iterations planned

---

## Support & Resources

- **KIMI K2.5 Docs:** https://api.nvidia.com/docs/
- **Project Files:** Check ARCHITECTURE.md
- **Logs Location:** `kimi_automation_logs/`
- **Prompts Reference:** KIMI_WORKFLOW_PROMPTS.md

---

## Notes

- Each iteration calls KIMI multiple times (4-5 API calls per iteration)
- Extended thinking enabled for deeper analysis
- All responses are streaming for real-time feedback
- Logs JSON format for easy parsing and integration

**Ready to start? Run:**
```bash
python scripts/kimi-automation.py 1
```
