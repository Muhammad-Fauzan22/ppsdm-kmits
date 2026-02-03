#!/usr/bin/env python3
"""
KIMI K2.5 Executor Script
This script acts as the interface between Gemini Pro (Commander) and KIMI K2.5 (Executor).
It accepts commands from terminal and sends them to KIMI K2.5 via NVIDIA API.
"""

import requests
import sys
import json
import time

# Configuration
INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
API_KEY = "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"

def call_kimi(prompt_text, stream=False):
    """
    Send a command to KIMI K2.5 and return the response.
    
    Args:
        prompt_text: The command/instruction to send to KIMI
        stream: Whether to use streaming mode (default: False)
    
    Returns:
        The response content from KIMI K2.5
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "text/event-stream" if stream else "application/json"
    }
    
    payload = {
        "model": "moonshotai/kimi-k2.5",
        "messages": [{"role": "user", "content": prompt_text}],
        "max_tokens": 16384,
        "temperature": 0.7,  # Slightly lower for more stable coding
        "top_p": 1.00,
        "stream": stream,
        "chat_template_kwargs": {"thinking": True},
    }
    
    try:
        response = requests.post(INVOKE_URL, headers=headers, json=payload, timeout=120)
        
        if response.status_code == 200:
            if stream:
                # Handle streaming response
                full_content = ""
                for line in response.iter_lines():
                    if line:
                        try:
                            # Parse SSE format
                            if line.startswith("data: "):
                                data_str = line[6:].strip()
                                if data_str == "[DONE]":
                                    break
                                data = json.loads(data_str)
                                if "choices" in data and len(data["choices"]) > 0:
                                    content = data["choices"][0].get("message", {}).get("content", "")
                                    full_content += content
                        except json.JSONDecodeError:
                            continue
                return full_content
            else:
                # Handle non-streaming response
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"]
                else:
                    return "Error: No content in response"
        else:
            return f"Error: HTTP {response.status_code} - {response.text}"
    
    except requests.exceptions.Timeout:
        return "Error: Request timeout (120s)"
    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"


def main():
    """Main entry point for the script."""
    if len(sys.argv) > 1:
        # Command line mode: Execute the provided instruction
        user_input = " ".join(sys.argv[1:])
        print(f"🚀 Sending to KIMI K2.5: {user_input}")
        print("-" * 60)
        
        result = call_kimi(user_input)
        
        print("-" * 60)
        print(result)
    else:
        # Interactive mode: Show usage
        print("""
╔══════════════════════════════════════════════════════════════╗
║           KIMI K2.5 Executor - Command Line Interface          ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  python kimi_exec.py "[INSTRUCTION_FOR_KIMI]"

Examples:
  python kimi_exec.py "Create a React component for user login"
  python kimi_exec.py "Fix the middleware authentication bug"
  python kimi_exec.py "Add unit tests for assessment module"

Note: This script is designed to be called by Gemini Pro in an
      automated loop. Gemini will analyze the output and send the next
      command automatically.
        """)


if __name__ == "__main__":
    main()
