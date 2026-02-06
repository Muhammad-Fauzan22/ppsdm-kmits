#!/usr/bin/env python3
"""
PPSDM KMITS - Complete Database Schema Execution
================================================

This script executes the complete integrated schema to Supabase.
Uses Supabase REST API with service_role key.

Author: PPSDM KMITS Team
Version: 2.0.0
"""

import os
import sys
import json
import requests
import time
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

# Configuration
SUPABASE_URL = "https://xncugiuvaetzjxuyfsko.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3VnaXV2YWV0emp4dXlmc2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njk4NDgsImV4cCI6MjA4NDI0NTg0OH0.KdxR6patiWJNbvrGOmyaamiP_AXwpGo9abIrl2FVTKk"

# Get service role key from environment or use provided
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_ANON_KEY)

class SupabaseSchemaExecutor:
    def __init__(self, url: str, key: str):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        self.results = []
        
    def execute_sql(self, sql: str, description: str = "SQL Execution") -> Tuple[bool, Any]:
        """Execute SQL using Supabase REST API"""
        try:
            # Use the exec_sql function if available, otherwise use REST
            endpoint = f"{self.url}/rest/v1/rpc/exec_sql"
            
            payload = {"sql": sql}
            
            response = requests.post(
                endpoint,
                headers=self.headers,
                json=payload,
                timeout=120
            )
            
            if response.status_code in [200, 201, 204]:
                return True, response.json() if response.text else None
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                return False, error_msg
                
        except Exception as e:
            return False, str(e)
    
    def execute_sql_batch(self, sql_statements: List[str], batch_name: str) -> Dict[str, Any]:
        """Execute a batch of SQL statements"""
        print(f"\n{'='*60}")
        print(f"Executing: {batch_name}")
        print(f"{'='*60}")
        
        success_count = 0
        error_count = 0
        errors = []
        
        for i, sql in enumerate(sql_statements, 1):
            if not sql.strip():
                continue
                
            success, result = self.execute_sql(sql, f"Statement {i}")
            
            if success:
                success_count += 1
                print(f"  ✓ Statement {i}: OK")
            else:
                error_count += 1
                errors.append(f"Statement {i}: {result}")
                print(f"  ✗ Statement {i}: FAILED - {result[:100]}...")
        
        return {
            "batch_name": batch_name,
            "total": len([s for s in sql_statements if s.strip()]),
            "success": success_count,
            "errors": error_count,
            "error_details": errors
        }
    
    def read_sql_file(self, filepath: str) -> List[str]:
        """Read SQL file and split into statements"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split by semicolon but preserve function bodies
            statements = []
            current = ""
            in_function = False
            
            for line in content.split('\n'):
                line_stripped = line.strip()
                
                # Skip comments
                if line_stripped.startswith('--') or line_stripped.startswith('/*'):
                    continue
                
                # Track function bodies
                if 'CREATE OR REPLACE FUNCTION' in line.upper():
                    in_function = True
                
                if in_function:
                    current += line + "\n"
                    if line_stripped.endswith('$$;') or line_stripped.endswith('$$ LANGUAGE'):
                        in_function = False
                        statements.append(current.strip())
                        current = ""
                else:
                    if ';' in line:
                        parts = line.split(';')
                        for i, part in enumerate(parts[:-1]):
                            current += part
                            if current.strip():
                                statements.append(current.strip())
                            current = ""
                        current = parts[-1]
                    else:
                        current += line + "\n"
            
            # Add remaining
            if current.strip():
                statements.append(current.strip())
            
            return [s for s in statements if s.strip()]
            
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return []
    
    def verify_setup(self) -> Dict[str, Any]:
        """Verify database setup"""
        print(f"\n{'='*60}")
        print("Verifying Database Setup")
        print(f"{'='*60}")
        
        checks = {
            "extensions": "SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'vector')",
            "tables": "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename",
            "dimensions": "SELECT slug, name FROM dimensions ORDER BY order_index",
            "badges": "SELECT slug, name FROM badges ORDER BY xp_reward",
            "rls_enabled": "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true"
        }
        
        results = {}
        for name, sql in checks.items():
            success, result = self.execute_sql(sql, f"Check: {name}")
            if success and isinstance(result, list):
                results[name] = len(result)
                print(f"  ✓ {name}: {len(result)} items")
            else:
                results[name] = 0
                print(f"  ✗ {name}: Failed")
        
        return results
    
    def run_complete_setup(self):
        """Run complete database setup"""
        print(f"""
{'='*80}
PPSDM KMITS - Complete Database Setup
{'='*80}
Project: {SUPABASE_URL}
Time: {time.strftime('%Y-%m-%d %H:%M:%S')}
{'='*80}
""")
        
        # Get script directory
        script_dir = Path(__file__).parent.parent / "supabase"
        
        # Execute main schema
        schema_file = script_dir / "complete_integrated_schema.sql"
        if schema_file.exists():
            statements = self.read_sql_file(str(schema_file))
            result = self.execute_sql_batch(statements, "Main Schema")
            self.results.append(result)
        else:
            print(f"Schema file not found: {schema_file}")
        
        # Execute RLS policies
        rls_file = script_dir / "rls_policies.sql"
        if rls_file.exists():
            statements = self.read_sql_file(str(rls_file))
            result = self.execute_sql_batch(statements, "RLS Policies")
            self.results.append(result)
        
        # Verify setup
        verification = self.verify_setup()
        
        # Print summary
        print(f"\n{'='*80}")
        print("SETUP SUMMARY")
        print(f"{'='*80}")
        
        total_success = 0
        total_errors = 0
        
        for result in self.results:
            print(f"\n{result['batch_name']}:")
            print(f"  Total Statements: {result['total']}")
            print(f"  Successful: {result['success']}")
            print(f"  Failed: {result['errors']}")
            total_success += result['success']
            total_errors += result['errors']
            
            if result['error_details']:
                print("  Errors:")
                for err in result['error_details'][:5]:  # Show first 5
                    print(f"    - {err[:100]}...")
        
        print(f"\n{'='*80}")
        print(f"OVERALL: {total_success} successful, {total_errors} failed")
        print(f"{'='*80}")
        
        # Save report
        report = {
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "project": SUPABASE_URL,
            "results": self.results,
            "verification": verification,
            "summary": {
                "total_success": total_success,
                "total_errors": total_errors
            }
        }
        
        report_file = Path(__file__).parent / "setup_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"\nReport saved to: {report_file}")
        
        return total_errors == 0


def main():
    """Main entry point"""
    print("PPSDM KMITS Database Setup")
    print("=" * 60)
    
    # Check for service role key
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not service_key:
        print("\n⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not set!")
        print("Using anon key - some operations may fail.")
        print("Set the service role key for full access:")
        print("  export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key")
        service_key = SUPABASE_ANON_KEY
    
    # Create executor
    executor = SupabaseSchemaExecutor(SUPABASE_URL, service_key)
    
    # Run setup
    success = executor.run_complete_setup()
    
    if success:
        print("\n✅ Database setup completed successfully!")
        return 0
    else:
        print("\n⚠️  Database setup completed with errors.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
