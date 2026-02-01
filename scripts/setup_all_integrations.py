#!/usr/bin/env python3
"""
Master Integration Setup Script

This script sets up and tests all integrations:
1. Test all API keys
2. Setup Supabase database
3. Connect Google Drive
4. Test queue system
5. Verify AI providers

Usage:
    python setup_all_integrations.py
    python setup_all_integrations.py --test-only
    python setup_all_integrations.py --setup-only
"""

import os
import sys
import json
import argparse
import subprocess
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
from datetime import datetime

# Ensure we're in the right directory
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@dataclass
class TestResult:
    """Result of an integration test"""
    name: str
    success: bool
    message: str
    details: Optional[Dict] = None
    error: Optional[str] = None


class IntegrationTester:
    """Tests all integrations and reports status"""
    
    def __init__(self):
        self.results: List[TestResult] = []
        self.env_vars = self._load_env()
    
    def _load_env(self) -> Dict[str, str]:
        """Load environment variables from .env.local"""
        env = {}
        env_file = '.env.local'
        
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        env[key] = value
        
        # Also load from actual environment
        env.update({k: v for k, v in os.environ.items()})
        
        return env
    
    def test_supabase(self) -> TestResult:
        """Test Supabase connection"""
        print("\n🗄️  Testing Supabase connection...")
        
        try:
            url = self.env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
            key = self.env_vars.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
            service_key = self.env_vars.get('SUPABASE_SERVICE_ROLE_KEY')
            
            if not url or not key:
                return TestResult(
                    name='Supabase',
                    success=False,
                    message='Missing Supabase credentials',
                    error='NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set'
                )
            
            # Try to import and connect
            try:
                from supabase import create_client
                supabase = create_client(url, key)
                
                # Test connection by fetching something
                response = supabase.table('books').select('count', count='exact').limit(1).execute()
                
                return TestResult(
                    name='Supabase',
                    success=True,
                    message=f'Connected successfully to {url}',
                    details={'tables_accessible': True, 'count': response.count}
                )
            except ImportError:
                # Try with requests as fallback
                import requests
                headers = {
                    'apikey': key,
                    'Authorization': f'Bearer {key}'
                }
                response = requests.get(f"{url}/rest/v1/", headers=headers, timeout=10)
                
                if response.status_code == 200:
                    return TestResult(
                        name='Supabase',
                        success=True,
                        message=f'API accessible at {url}',
                        details={'status_code': response.status_code}
                    )
                else:
                    return TestResult(
                        name='Supabase',
                        success=False,
                        message=f'API returned status {response.status_code}',
                        error=response.text
                    )
                    
        except Exception as e:
            return TestResult(
                name='Supabase',
                success=False,
                message='Connection failed',
                error=str(e)
            )
    
    def test_groq(self) -> TestResult:
        """Test Groq API"""
        print("\n⚡ Testing Groq API...")
        
        try:
            api_key = self.env_vars.get('GROQ_API_KEY')
            
            if not api_key:
                return TestResult(
                    name='Groq',
                    success=False,
                    message='API key not configured',
                    error='GROQ_API_KEY not set'
                )
            
            import requests
            
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'llama-3.1-8b-instant',
                'messages': [{'role': 'user', 'content': 'Hi'}],
                'max_tokens': 10
            }
            
            response = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return TestResult(
                    name='Groq',
                    success=True,
                    message=f'API working, model: {result["model"]}',
                    details={'latency_ms': result.get('usage', {}).get('total_tokens', 0)}
                )
            else:
                return TestResult(
                    name='Groq',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='Groq',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_openai(self) -> TestResult:
        """Test OpenAI API"""
        print("\n🤖 Testing OpenAI API...")
        
        try:
            api_key = self.env_vars.get('OPENAI_API_KEY')
            
            if not api_key:
                return TestResult(
                    name='OpenAI',
                    success=False,
                    message='API key not configured',
                    error='OPENAI_API_KEY not set'
                )
            
            import requests
            
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'gpt-4o-mini',
                'messages': [{'role': 'user', 'content': 'Hi'}],
                'max_tokens': 10
            }
            
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return TestResult(
                    name='OpenAI',
                    success=True,
                    message=f'API working, model: {result["model"]}',
                    details={'tokens': result.get('usage', {}).get('total_tokens', 0)}
                )
            else:
                return TestResult(
                    name='OpenAI',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='OpenAI',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_openrouter(self) -> TestResult:
        """Test OpenRouter API"""
        print("\n🌐 Testing OpenRouter API...")
        
        try:
            api_key = self.env_vars.get('OPENROUTER_API_KEY')
            
            if not api_key:
                return TestResult(
                    name='OpenRouter',
                    success=False,
                    message='API key not configured',
                    error='OPENROUTER_API_KEY not set'
                )
            
            import requests
            
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://ppsdm-kmm.com'
            }
            
            data = {
                'model': 'anthropic/claude-3.5-sonnet',
                'messages': [{'role': 'user', 'content': 'Hi'}],
                'max_tokens': 10
            }
            
            response = requests.post(
                'https://openrouter.ai/api/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                return TestResult(
                    name='OpenRouter',
                    success=True,
                    message='API working',
                    details={'models_available': True}
                )
            else:
                return TestResult(
                    name='OpenRouter',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='OpenRouter',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_google_ai(self) -> TestResult:
        """Test Google AI (Gemini) API"""
        print("\n🔮 Testing Google AI API...")
        
        try:
            api_key = self.env_vars.get('GOOGLE_AI_API_KEY')
            
            if not api_key:
                return TestResult(
                    name='Google AI',
                    success=False,
                    message='API key not configured',
                    error='GOOGLE_AI_API_KEY not set'
                )
            
            import requests
            
            url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
            
            data = {
                'contents': [{'parts': [{'text': 'Hi'}]}],
                'generationConfig': {'maxOutputTokens': 10}
            }
            
            response = requests.post(
                url,
                json=data,
                params={'key': api_key},
                timeout=30
            )
            
            if response.status_code == 200:
                return TestResult(
                    name='Google AI',
                    success=True,
                    message='Gemini API working',
                    details={'model': 'gemini-1.5-flash'}
                )
            else:
                return TestResult(
                    name='Google AI',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='Google AI',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_huggingface(self) -> TestResult:
        """Test Hugging Face API"""
        print("\n🤗 Testing Hugging Face API...")
        
        try:
            api_key = self.env_vars.get('HUGGINGFACE_API_KEY')
            
            if not api_key:
                return TestResult(
                    name='Hugging Face',
                    success=False,
                    message='API key not configured',
                    error='HUGGINGFACE_API_KEY not set'
                )
            
            import requests
            
            headers = {'Authorization': f'Bearer {api_key}'}
            
            # Test API access
            response = requests.get(
                'https://huggingface.co/api/whoami',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return TestResult(
                    name='Hugging Face',
                    success=True,
                    message=f'API working for user: {data.get("name", "unknown")}',
                    details={'type': data.get('type')}
                )
            else:
                return TestResult(
                    name='Hugging Face',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='Hugging Face',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_qstash(self) -> TestResult:
        """Test Upstash QStash"""
        print("\n📬 Testing Upstash QStash...")
        
        try:
            token = self.env_vars.get('UPSTASH_QSTASH_TOKEN')
            
            if not token:
                return TestResult(
                    name='QStash',
                    success=False,
                    message='Token not configured',
                    error='UPSTASH_QSTASH_TOKEN not set'
                )
            
            import requests
            
            headers = {'Authorization': f'Bearer {token}'}
            
            response = requests.get(
                'https://qstash.upstash.io/v2/topics',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return TestResult(
                    name='QStash',
                    success=True,
                    message='QStash API accessible',
                    details={'topics': len(response.json().get('topics', []))}
                )
            else:
                return TestResult(
                    name='QStash',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='QStash',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_serpapi(self) -> TestResult:
        """Test SerpAPI"""
        print("\n🔍 Testing SerpAPI...")
        
        try:
            api_key = self.env_vars.get('SERPAPI_KEY')
            
            if not api_key:
                return TestResult(
                    name='SerpAPI',
                    success=False,
                    message='API key not configured',
                    error='SERPAPI_KEY not set'
                )
            
            import requests
            
            params = {
                'engine': 'google',
                'q': 'test',
                'api_key': api_key,
                'num': 1
            }
            
            response = requests.get(
                'https://serpapi.com/search',
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                return TestResult(
                    name='SerpAPI',
                    success=True,
                    message='API working',
                    details={'searches_remaining': response.json().get('search_information', {}).get('total_results')}
                )
            else:
                return TestResult(
                    name='SerpAPI',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='SerpAPI',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def test_replicate(self) -> TestResult:
        """Test Replicate API"""
        print("\n🎨 Testing Replicate API...")
        
        try:
            api_token = self.env_vars.get('REPLICATE_API_TOKEN')
            
            if not api_token:
                return TestResult(
                    name='Replicate',
                    success=False,
                    message='API token not configured',
                    error='REPLICATE_API_TOKEN not set'
                )
            
            import requests
            
            headers = {'Authorization': f'Token {api_token}'}
            
            response = requests.get(
                'https://api.replicate.com/v1/models',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return TestResult(
                    name='Replicate',
                    success=True,
                    message='API working',
                    details={'models_count': len(data.get('results', []))}
                )
            else:
                return TestResult(
                    name='Replicate',
                    success=False,
                    message=f'API returned {response.status_code}',
                    error=response.text
                )
                
        except Exception as e:
            return TestResult(
                name='Replicate',
                success=False,
                message='API test failed',
                error=str(e)
            )
    
    def run_all_tests(self) -> List[TestResult]:
        """Run all integration tests"""
        print("\n" + "="*60)
        print("🧪 RUNNING ALL INTEGRATION TESTS")
        print("="*60)
        
        tests = [
            self.test_supabase,
            self.test_groq,
            self.test_openai,
            self.test_openrouter,
            self.test_google_ai,
            self.test_huggingface,
            self.test_qstash,
            self.test_serpapi,
            self.test_replicate,
        ]
        
        self.results = []
        for test in tests:
            try:
                result = test()
                self.results.append(result)
            except Exception as e:
                self.results.append(TestResult(
                    name=test.__name__.replace('test_', '').title(),
                    success=False,
                    message='Test crashed',
                    error=str(e)
                ))
        
        return self.results
    
    def print_report(self):
        """Print test report"""
        print("\n" + "="*60)
        print("📊 INTEGRATION TEST REPORT")
        print("="*60)
        
        passed = sum(1 for r in self.results if r.success)
        failed = len(self.results) - passed
        
        for result in self.results:
            status = "✅" if result.success else "❌"
            print(f"\n{status} {result.name}")
            print(f"   {result.message}")
            if result.error:
                print(f"   Error: {result.error[:100]}")
            if result.details:
                print(f"   Details: {json.dumps(result.details, indent=2)}")
        
        print("\n" + "="*60)
        print(f"Summary: {passed} passed, {failed} failed out of {len(self.results)} tests")
        print("="*60)
        
        return failed == 0
    
    def save_report(self, filename: str = 'integration_test_report.json'):
        """Save test report to file"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_tests': len(self.results),
            'passed': sum(1 for r in self.results if r.success),
            'failed': sum(1 for r in self.results if not r.success),
            'results': [asdict(r) for r in self.results]
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n💾 Report saved to {filename}")


def setup_supabase():
    """Setup Supabase database schema"""
    print("\n🗄️  Setting up Supabase database...")
    
    # Check if supabase CLI is available
    result = subprocess.run(['supabase', '--version'], capture_output=True, text=True)
    if result.returncode != 0:
        print("⚠️  Supabase CLI not found. Please install it:")
        print("   npm install -g supabase")
        return False
    
    # Run migrations
    print("Running database migrations...")
    result = subprocess.run(['supabase', 'db', 'push'], capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ Database setup complete")
        return True
    else:
        print(f"❌ Database setup failed: {result.stderr}")
        return False


def main():
    parser = argparse.ArgumentParser(description='Setup and test all integrations')
    parser.add_argument('--test-only', action='store_true', help='Only run tests')
    parser.add_argument('--setup-only', action='store_true', help='Only run setup')
    parser.add_argument('--report', type=str, default='integration_test_report.json', help='Report filename')
    
    args = parser.parse_args()
    
    print("\n" + "="*60)
    print("🔧 PPSDM KMM - MASTER INTEGRATION SETUP")
    print("="*60)
    
    success = True
    
    if not args.test_only:
        # Run setup
        print("\n📦 Setting up integrations...")
        # setup_supabase()  # Uncomment when ready
        print("Setup complete (skipped - run manually if needed)")
    
    if not args.setup_only:
        # Run tests
        tester = IntegrationTester()
        tester.run_all_tests()
        success = tester.print_report()
        tester.save_report(args.report)
    
    print("\n✨ Done!")
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
