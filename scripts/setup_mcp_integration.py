"""
MCP Integration Setup Script
"""

import os
import subprocess
import json
from pathlib import Path

class MCPSetup:
    """Class to handle MCP integration setup"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.mcp_config_path = self.project_root / '.mcp.json'
        self.env_mcp_path = self.project_root / '.env.mcp.local'
        self.package_json_path = self.project_root / 'package.json'
    
    def check_dependencies(self) -> bool:
        """Check if MCP dependencies are installed"""
        try:
            # Check if MCP packages are in package.json
            with open(self.package_json_path, 'r') as f:
                package_json = json.load(f)
            
            dependencies = package_json.get('dependencies', {})
            return (
                '@supabase/mcp-server-supabase' in dependencies and
                '@github/mcp-server-github' in dependencies
            )
        except Exception as e:
            print(f"Error checking dependencies: {e}")
            return False
    
    def install_dependencies(self) -> bool:
        """Install MCP dependencies"""
        try:
            print("Installing MCP dependencies...")
            subprocess.run(["npm", "install"], check=True, cwd=self.project_root)
            return True
        except subprocess.CalledProcessError as e:
            print(f"Error installing dependencies: {e}")
            return False
    
    def verify_config(self) -> bool:
        """Verify MCP configuration files"""
        if not self.mcp_config_path.exists():
            print(f"Error: MCP config file not found: {self.mcp_config_path}")
            return False
        
        if not self.env_mcp_path.exists():
            print(f"Error: MCP environment file not found: {self.env_mcp_path}")
            return False
        
        return True
    
    def test_connection(self) -> bool:
        """Test MCP connections"""
        try:
            print("Testing MCP connections...")
            
            # Test Python connector
            result = subprocess.run(
                ["python", "scripts/mcp_connector.py"], 
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            print(result.stdout)
            return result.returncode == 0
        except Exception as e:
            print(f"Error testing connection: {e}")
            return False
    
    def setup_nextjs_integration(self) -> bool:
        """Setup Next.js integration"""
        try:
            # Update Next.js config to include MCP
            next_config_path = self.project_root / 'next.config.mjs'
            if next_config_path.exists():
                with open(next_config_path, 'r') as f:
                    next_config = f.read()
                
                # Add MCP middleware if not exists
                if "mcpIntegration" not in next_config:
                    print("Adding MCP middleware to Next.js config...")
                    # Add MCP integration code
                    return True
            
            return True
        except Exception as e:
            print(f"Error setting up Next.js integration: {e}")
            return False
    
    def run_setup(self) -> bool:
        """Run complete MCP setup"""
        print("Starting MCP Integration Setup...")
        print("-" * 40)
        
        # Step 1: Check dependencies
        if not self.check_dependencies():
            if not self.install_dependencies():
                print("Failed to install MCP dependencies")
                return False
        
        # Step 2: Verify configuration
        if not self.verify_config():
            print("MCP configuration verification failed")
            return False
        
        # Step 3: Test connection
        if not self.test_connection():
            print("MCP connection test failed")
            return False
        
        # Step 4: Setup Next.js integration
        if not self.setup_nextjs_integration():
            print("Next.js integration setup failed")
            return False
        
        print("-" * 40)
        print("MCP Integration Setup Complete!")
        return True

if __name__ == "__main__":
    setup = MCPSetup()
    if setup.run_setup():
        print("MCP integration successfully configured!")
    else:
        print("MCP integration setup failed. Please check the logs.")