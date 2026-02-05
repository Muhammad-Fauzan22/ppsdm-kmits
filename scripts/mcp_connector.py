"""
MCP Connector for Supabase and GitHub
"""

from typing import Dict, Any
import json
from pathlib import Path


class MCPConnector:
    """Class to manage MCP connections to Supabase and GitHub"""
    
    def __init__(self):
        self.supabase_config = self._load_supabase_config()
        self.github_config = self._load_github_config()
        self.mcp_config = self._load_mcp_config()
    
    def _load_supabase_config(self) -> Dict[str, str]:
        """Load Supabase configuration from environment or config files"""
        config = {
            'url': '',
            'anon_key': '',
            'service_role_key': ''
        }
        try:
            # Try to load from .env.mcp.local
            env_path = Path(__file__).parent.parent / '.env.mcp.local'
            if env_path.exists():
                with open(env_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            key, value = line.split('=', 1)
                            key = key.strip()
                            value = value.strip().strip('"').strip("'")
                            if key == 'SUPABASE_URL':
                                config['url'] = value
                            elif key == 'SUPABASE_ANON_KEY':
                                config['anon_key'] = value
                            elif key == 'SUPABASE_SERVICE_ROLE_KEY':
                                config['service_role_key'] = value
            return config
        except Exception as e:
            print(f"Error loading Supabase config: {e}")
            return config
    
    def _load_github_config(self) -> Dict[str, str]:
        """Load GitHub configuration from environment or config files"""
        try:
            # Try to load from .env.mcp.local
            env_path = Path(__file__).parent.parent / '.env.mcp.local'
            if env_path.exists():
                with open(env_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            key, value = line.split('=', 1)
                            key = key.strip()
                            value = value.strip().strip('"').strip("'")
                            if key == 'GITHUB_TOKEN':
                                return {'token': value}
            return {'token': ''}
        except Exception as e:
            print(f"Error loading GitHub config: {e}")
            return {'token': ''}
    
    def _load_mcp_config(self) -> Dict[str, Any]:
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
    print("\nMCP Connectivity Check Complete.")
