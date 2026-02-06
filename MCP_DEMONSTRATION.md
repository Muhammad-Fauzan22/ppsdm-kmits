# Supabase MCP Server Setup - Demonstration

## Configuration Complete ✓

The Supabase MCP server has been successfully configured with the following settings:

### Server Configuration

**Server Name**: `github.com/supabase-community/supabase-mcp`

**Configuration Files Updated**:
1. `blackbox_mcp_settings.json` (Blackbox AI settings)
2. `.mcp.json` (Project-level MCP settings)

**Server URL**: 
```
https://mcp.supabase.com/mcp?project_ref=xncugiuvaetzjxuyfsko&read_only=true&features=database,docs,debugging,development
```

**Security Settings**:
- ✅ **Read-only mode**: Enabled (prevents write operations)
- ✅ **Project scoped**: Limited to project `xncugiuvaetzjxuyfsko`
- ✅ **Feature groups**: Limited to database, docs, debugging, development

---

## Available Tools

The MCP server provides the following tools grouped by feature:

### 1. Database Tools (Enabled)
- `list_tables` - Lists all tables within the specified schemas
- `list_extensions` - Lists all extensions in the database
- `list_migrations` - Lists all migrations in the database
- `execute_sql` - Executes raw SQL queries (read-only in this configuration)

### 2. Knowledge Base Tools (Enabled)
- `search_docs` - Searches the Supabase documentation for up-to-date information

### 3. Debugging Tools (Enabled)
- `get_logs` - Gets logs for the Supabase project by service type (api, postgres, edge functions, auth, storage, realtime)
- `get_advisors` - Gets advisory notices for security vulnerabilities or performance issues

### 4. Development Tools (Enabled)
- `get_project_url` - Gets the API URL for the project
- `get_publishable_keys` - Gets the anonymous API keys for the project
- `generate_typescript_types` - Generates TypeScript types based on the database schema

### Disabled Tools (For Security)
The following tools are disabled in read-only mode:
- `apply_migration` - Applies SQL migrations
- `create_project` - Creates new projects
- `pause_project` - Pauses projects
- `restore_project` - Restores projects
- `deploy_edge_function` - Deploys edge functions
- `create_branch`, `delete_branch`, `merge_branch`, `reset_branch`, `rebase_branch` - Branching operations
- `update_storage_config` - Updates storage configuration

---

## Example Tool Usage

### Example 1: List Database Tables

```json
{
  "tool": "list_tables",
  "params": {
    "schemas": ["public"]
  }
}
```

**Expected Response**:
```json
{
  "tables": [
    {
      "name": "users",
      "schema": "public",
      "columns": [...]
    },
    {
      "name": "courses",
      "schema": "public", 
      "columns": [...]
    }
  ]
}
```

### Example 2: Execute SQL Query (Read-only)

```json
{
  "tool": "execute_sql",
  "params": {
    "query": "SELECT * FROM users LIMIT 10"
  }
}
```

### Example 3: Search Supabase Documentation

```json
{
  "tool": "search_docs",
  "params": {
    "query": "how to set up row level security"
  }
}
```

### Example 4: Get Project Logs

```json
{
  "tool": "get_logs",
  "params": {
    "service": "postgres",
    "limit": 100
  }
}
```

### Example 5: Generate TypeScript Types

```json
{
  "tool": "generate_typescript_types",
  "params": {}
}
```

---

## Security Features

### Read-Only Mode
All SQL queries are executed as a read-only Postgres user, preventing:
- Data modification (INSERT, UPDATE, DELETE)
- Schema changes (CREATE, ALTER, DROP)
- Privilege escalation

### Project Scoping
The server is scoped to a specific project (`xncugiuvaetzjxuyfsko`), preventing access to:
- Other projects in your Supabase account
- Account-level operations (listing all projects, creating new projects)

### Feature Group Restrictions
Only specific tool groups are enabled:
- ✅ Database (read-only queries)
- ✅ Documentation search
- ✅ Debugging (logs, advisors)
- ✅ Development (URLs, keys, type generation)
- ❌ Account management
- ❌ Storage management
- ❌ Edge functions deployment
- ❌ Branching operations

---

## Next Steps

1. **Authentication**: When you first use the MCP server, you'll be prompted to log in to Supabase via OAuth
2. **Tool Invocation**: Use natural language to ask the AI to perform Supabase operations
3. **Review Before Execution**: Always review tool calls before executing them (recommended security practice)

---

## Usage Examples with AI Assistant

You can now ask your AI assistant to perform operations like:

1. **"Show me all tables in the database"**
   - AI will use `list_tables` tool

2. **"What's the schema of the users table?"**
   - AI will use `execute_sql` with `SELECT * FROM users LIMIT 0`

3. **"Search Supabase docs for authentication best practices"**
   - AI will use `search_docs` tool

4. **"Generate TypeScript types for my database schema"**
   - AI will use `generate_typescript_types` tool

5. **"Show me recent PostgreSQL logs"**
   - AI will use `get_logs` tool with service="postgres"

---

## Configuration Reference

### blackbox_mcp_settings.json
```json
{
  "mcpServers": {
    "github.com/supabase-community/supabase-mcp": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=xncugiuvaetzjxuyfsko&read_only=true&features=database,docs,debugging,development"
    }
  }
}
```

### .mcp.json
```json
{
  "mcpServers": {
    "github.com/supabase-community/supabase-mcp": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=xncugiuvaetzjxuyfsko&read_only=true&features=database,docs,debugging,development"
    }
  }
}
```

---

## Troubleshooting

### Issue: MCP Server Not Connecting
- Ensure you have OAuth access to the Supabase project
- Check that the project_ref is correct
- Verify your Supabase account has access to project `xncugiuvaetzjxuyfsko`

### Issue: Tools Not Available
- Check that the `features` parameter includes the desired tool groups
- Some tools require specific project permissions or paid plans

### Issue: Read-Only Mode Blocking Needed Operations
- Remove `read_only=true` from the URL (not recommended for production)
- Use a development/staging project instead

---

## Resources

- [Supabase MCP Server Repository](https://github.com/supabase-community/supabase-mcp)
- [MCP Documentation](https://modelcontextprotocol.io/introduction)
- [Supabase MCP Setup Guide](https://supabase.com/docs/guides/getting-started/mcp)
