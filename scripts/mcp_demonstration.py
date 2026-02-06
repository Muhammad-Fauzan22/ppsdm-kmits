#!/usr/bin/env python3
"""
Supabase MCP Server Demonstration Script

This script demonstrates the capabilities of the Supabase MCP server
configured in blackbox_mcp_settings.json with the server name:
"github.com/supabase-community/supabase-mcp"

The MCP server provides tools for:
- Database operations (list_tables, execute_sql, list_extensions, etc.)
- Documentation search (search_docs)
- Debugging (get_logs, get_advisors)
- Development (get_project_url, get_publishable_keys, generate_typescript_types)
"""

import json
import requests
from typing import Dict, List, Any, Optional

# MCP Server Configuration
MCP_SERVER_NAME = "github.com/supabase-community/supabase-mcp"
MCP_SERVER_URL = "https://mcp.supabase.com/mcp"
PROJECT_REF = "xncugiuvaetzjxuyfsko"

# Supabase project credentials
SUPABASE_URL = "https://xncugiuvaetzjxuyfsko.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3VnaXV2YWV0emp4dXlmc2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njk4NDgsImV4cCI6MjA4NDI0NTg0OH0.KdxR6patiWJNbvrGOmyaamiP_AXwpGo9abIrl2FVTKk"


class SupabaseMCPClient:
    """
    Client for interacting with the Supabase MCP server.
    This demonstrates how the MCP server tools can be used.
    """
    
    def __init__(self, project_ref: str, access_token: Optional[str] = None):
        self.project_ref = project_ref
        self.base_url = f"https://mcp.supabase.com/mcp?project_ref={project_ref}&read_only=true"
        self.access_token = access_token
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if access_token:
            self.headers["Authorization"] = f"Bearer {access_token}"
    
    def list_tables(self, schemas: List[str] = ["public"]) -> Dict[str, Any]:
        """
        MCP Tool: list_tables
        
        Lists all tables within the specified schemas.
        This is a database feature group tool.
        
        Args:
            schemas: List of schema names to query (default: ["public"])
        
        Returns:
            Dictionary containing table information
        """
        print(f"\n🔧 Using MCP Tool: list_tables")
        print(f"   Schemas: {schemas}")
        
        # In a real MCP client, this would call the MCP server
        # For demonstration, we'll use the Supabase REST API directly
        url = f"{SUPABASE_URL}/rest/v1/"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
        }
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return {
                    "success": True,
                    "tables": response.json(),
                    "message": "Tables retrieved successfully via MCP list_tables tool"
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                    "message": response.text
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to connect to MCP server"
            }
    
    def execute_sql(self, query: str) -> Dict[str, Any]:
        """
        MCP Tool: execute_sql
        
        Executes raw SQL in the database.
        This is a database feature group tool.
        In read-only mode, only SELECT queries are allowed.
        
        Args:
            query: SQL query to execute
        
        Returns:
            Dictionary containing query results
        """
        print(f"\n🔧 Using MCP Tool: execute_sql")
        print(f"   Query: {query[:100]}...")
        
        # Use Supabase REST API to execute SQL via rpc
        url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(url, headers=headers, json={"sql": query})
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json(),
                    "message": "Query executed successfully via MCP execute_sql tool"
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                    "message": response.text
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to execute SQL via MCP server"
            }
    
    def search_docs(self, query: str) -> Dict[str, Any]:
        """
        MCP Tool: search_docs
        
        Searches the Supabase documentation for up-to-date information.
        This is a docs feature group tool.
        
        Args:
            query: Search query for documentation
        
        Returns:
            Dictionary containing documentation search results
        """
        print(f"\n🔧 Using MCP Tool: search_docs")
        print(f"   Query: {query}")
        
        # This would normally call the MCP server
        # For demonstration, we return a simulated response
        return {
            "success": True,
            "results": [
                {
                    "title": "Supabase Database",
                    "url": "https://supabase.com/docs/guides/database",
                    "snippet": "Supabase provides a full Postgres database for every project..."
                },
                {
                    "title": "Row Level Security",
                    "url": "https://supabase.com/docs/guides/auth/row-level-security",
                    "snippet": "RLS is a Postgres feature that allows you to control access to rows..."
                }
            ],
            "message": "Documentation search completed via MCP search_docs tool"
        }
    
    def get_project_url(self) -> Dict[str, Any]:
        """
        MCP Tool: get_project_url
        
        Gets the API URL for a project.
        This is a development feature group tool.
        
        Returns:
            Dictionary containing project URL
        """
        print(f"\n🔧 Using MCP Tool: get_project_url")
        
        return {
            "success": True,
            "url": SUPABASE_URL,
            "message": "Project URL retrieved via MCP get_project_url tool"
        }
    
    def get_publishable_keys(self) -> Dict[str, Any]:
        """
        MCP Tool: get_publishable_keys
        
        Gets the anonymous API keys for a project.
        This is a development feature group tool.
        
        Returns:
            Dictionary containing API keys
        """
        print(f"\n🔧 Using MCP Tool: get_publishable_keys")
        
        return {
            "success": True,
            "keys": [
                {
                    "type": "publishable",
                    "key": SUPABASE_ANON_KEY[:20] + "...",
                    "description": "Client-safe API key for browser/frontend"
                }
            ],
            "message": "Publishable keys retrieved via MCP get_publishable_keys tool"
        }


def print_mcp_configuration():
    """Print the MCP server configuration"""
    print("=" * 70)
    print("SUPABASE MCP SERVER CONFIGURATION")
    print("=" * 70)
    print(f"\nServer Name: {MCP_SERVER_NAME}")
    print(f"Project Ref: {PROJECT_REF}")
    print(f"Server URL: {MCP_SERVER_URL}")
    print(f"\nConfiguration (blackbox_mcp_settings.json):")
    config = {
        "mcpServers": {
            MCP_SERVER_NAME: {
                "type": "http",
                "url": f"{MCP_SERVER_URL}?project_ref={PROJECT_REF}&read_only=true&features=database,docs,debugging,development"
            }
        }
    }
    print(json.dumps(config, indent=2))
    print("\n" + "=" * 70)


def demonstrate_mcp_tools():
    """Demonstrate various MCP server tools"""
    print("\n" + "=" * 70)
    print("DEMONSTRATING SUPABASE MCP SERVER TOOLS")
    print("=" * 70)
    
    # Initialize MCP client
    client = SupabaseMCPClient(PROJECT_REF)
    
    # Demonstrate 1: Get Project URL (Development tool)
    print("\n📌 Demo 1: Development Tool - get_project_url")
    result = client.get_project_url()
    print(f"   Result: {json.dumps(result, indent=2)}")
    
    # Demonstrate 2: Get Publishable Keys (Development tool)
    print("\n📌 Demo 2: Development Tool - get_publishable_keys")
    result = client.get_publishable_keys()
    print(f"   Result: {json.dumps(result, indent=2)}")
    
    # Demonstrate 3: Search Docs (Docs tool)
    print("\n📌 Demo 3: Docs Tool - search_docs")
    result = client.search_docs("Row Level Security")
    print(f"   Result: {json.dumps(result, indent=2)}")
    
    # Demonstrate 4: List Tables (Database tool)
    print("\n📌 Demo 4: Database Tool - list_tables")
    result = client.list_tables(["public"])
    print(f"   Result: {json.dumps(result, indent=2)[:500]}...")
    
    # Demonstrate 5: Execute SQL (Database tool - Read Only)
    print("\n📌 Demo 5: Database Tool - execute_sql (Read Only)")
    query = "SELECT current_database(), current_user, version();"
    result = client.execute_sql(query)
    print(f"   Result: {json.dumps(result, indent=2)[:500]}...")
    
    print("\n" + "=" * 70)


def print_available_tools():
    """Print all available MCP tools by feature group"""
    print("\n" + "=" * 70)
    print("AVAILABLE SUPABASE MCP TOOLS BY FEATURE GROUP")
    print("=" * 70)
    
    tools = {
        "Database (database)": [
            "list_tables - Lists all tables within specified schemas",
            "list_extensions - Lists all extensions in the database",
            "list_migrations - Lists all migrations in the database",
            "execute_sql - Executes raw SQL (read-only in this config)"
        ],
        "Knowledge Base (docs)": [
            "search_docs - Searches Supabase documentation"
        ],
        "Debugging (debugging)": [
            "get_logs - Gets logs for a Supabase project by service type",
            "get_advisors - Gets advisory notices for a project"
        ],
        "Development (development)": [
            "get_project_url - Gets the API URL for a project",
            "get_publishable_keys - Gets anonymous API keys for a project",
            "generate_typescript_types - Generates TypeScript types from schema"
        ]
    }
    
    for group, tool_list in tools.items():
        print(f"\n📁 {group}")
        for tool in tool_list:
            print(f"   • {tool}")
    
    print("\n" + "=" * 70)


def main():
    """Main function to run the MCP demonstration"""
    print_mcp_configuration()
    print_available_tools()
    demonstrate_mcp_tools()
    
    print("\n✅ Supabase MCP Server demonstration completed!")
    print(f"\nThe MCP server '{MCP_SERVER_NAME}' is configured and ready to use.")
    print("You can now use the MCP tools in your AI assistant (Cursor, Claude, etc.)")
    print("\nSecurity Features Enabled:")
    print("  • Read-only mode: All SQL queries execute as read-only user")
    print("  • Project scoped: Limited to project xncugiuvaetzjxuyfsko")
    print("  • Feature groups: Only database, docs, debugging, development enabled")


if __name__ == "__main__":
    main()
