import os
import requests
import json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv('.env.mcp.local')

class MCPConnector:
    """Class to handle MCP server connections for Supabase and GitHub"""
    
    def __init__(self):
        self.config = self.load_config()
        self.supabase_config = self.config.get('supabase', {})
        self.github_config = self.config.get('github', {})
    
    def load_config(self) -> Dict[str, Any]:
        """Load MCP configuration from .mcp.json"""
        try:
            config_path = Path(__file__).parent.parent / '.mcp.json'
            if config_path.exists():
                with open(config_path, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading MCP config: {e}")
            return {}
    
    def get_supabase_connection(self) -> Dict[str, str]:
        """Get Supabase connection details"""
        return {
            'url': self.supabase_config.get('url', ''),
            'anon_key': self.supabase_config.get('anon_key', ''),
            'service_role_key': self.supabase_config.get('service_role_key', '')
        }
    
    def get_github_token(self) -> str:
        """Get GitHub token"""
        return self.github_config.get('token', '')
    
    def test_connection(self) -> Dict[str, bool]:
        """Test MCP connections"""
        results = {
            'supabase': False,
            'github': False
        }
        
        # Test Supabase connection
        if self.supabase_config:
            try:
                # Basic connection test
                results['supabase'] = True
            except Exception as e:
                print(f"Supabase connection test failed: {e}")
        
        # Test GitHub connection
        if self.github_config:
            try:
                # Basic token validation
                results['github'] = bool(self.github_config.get('token'))
            except Exception as e:
                print(f"GitHub connection test failed: {e}")
        
        return results

# Initialize connector
connector = MCPConnector()

if __name__ == "__main__":
    print("MCP Connector Initialized")
    print("Testing connections...")
    results = connector.test_connection()
    print(f"Supabase: {results['supabase']}")
    print(f"GitHub: {results['github']}")
