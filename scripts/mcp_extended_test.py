#!/usr/bin/env python3
"""
Extended MCP Server Testing Script
Tests all remaining Supabase MCP tools
"""

import json
import requests
import sys
from datetime import datetime

# MCP Server Configuration
MCP_SERVER_URL = "https://mcp.supabase.com/mcp"
PROJECT_REF = "xncugiuvaetzjxuyfsko"

def make_mcp_request(tool_name, params=None):
    """Make a request to the MCP server"""
    url = f"{MCP_SERVER_URL}/{tool_name}?project_ref={PROJECT_REF}"
    if params:
        url += "&" + "&".join([f"{k}={v}" for k, v in params.items()])
    
    try:
        response = requests.post(url, timeout=30)
        return {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "data": response.json() if response.status_code == 200 else response.text
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def test_list_extensions():
    """Test list_extensions tool"""
    print("\n📌 Testing: list_extensions")
    result = make_mcp_request("list_extensions")
    if result["success"]:
        print(f"   ✅ Success - Retrieved {len(result['data'].get('extensions', []))} extensions")
    else:
        print(f"   ⚠️  Result: {result.get('data', result.get('error', 'Unknown error'))}")
    return result

def test_list_migrations():
    """Test list_migrations tool"""
    print("\n📌 Testing: list_migrations")
    result = make_mcp_request("list_migrations")
    if result["success"]:
        print(f"   ✅ Success - Retrieved {len(result['data'].get('migrations', []))} migrations")
    else:
        print(f"   ⚠️  Result: {result.get('data', result.get('error', 'Unknown error'))}")
    return result

def test_get_logs():
    """Test get_logs tool"""
    print("\n📌 Testing: get_logs")
    result = make_mcp_request("get_logs", {"service": "postgres", "limit": 10})
    if result["success"]:
        print(f"   ✅ Success - Retrieved logs")
    else:
        print(f"   ⚠️  Result: {result.get('data', result.get('error', 'Unknown error'))}")
    return result

def test_get_advisors():
    """Test get_advisors tool"""
    print("\n📌 Testing: get_advisors")
    result = make_mcp_request("get_advisors")
    if result["success"]:
        print(f"   ✅ Success - Retrieved {len(result['data'].get('advisors', []))} advisors")
    else:
        print(f"   ⚠️  Result: {result.get('data', result.get('error', 'Unknown error'))}")
    return result

def test_generate_typescript_types():
    """Test generate_typescript_types tool"""
    print("\n📌 Testing: generate_typescript_types")
    result = make_mcp_request("generate_typescript_types")
    if result["success"]:
        print(f"   ✅ Success - Generated TypeScript types")
    else:
        print(f"   ⚠️  Result: {result.get('data', result.get('error', 'Unknown error'))}")
    return result

def main():
    print("=" * 70)
    print("EXTENDED SUPABASE MCP SERVER TESTING")
    print("=" * 70)
    print(f"Project: {PROJECT_REF}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    results = {}
    
    # Test all remaining tools
    results["list_extensions"] = test_list_extensions()
    results["list_migrations"] = test_list_migrations()
    results["get_logs"] = test_get_logs()
    results["get_advisors"] = test_get_advisors()
    results["generate_typescript_types"] = test_generate_typescript_types()
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    successful = sum(1 for r in results.values() if r["success"])
    total = len(results)
    
    for tool, result in results.items():
        status = "✅ PASS" if result["success"] else "⚠️  CHECK"
        print(f"   {status} - {tool}")
    
    print(f"\nTotal: {successful}/{total} tools working")
    print("=" * 70)
    
    return 0 if successful == total else 1

if __name__ == "__main__":
    sys.exit(main())
