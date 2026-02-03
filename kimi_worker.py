#!/usr/bin/env python3
"""
KIMI K2.5 Worker Script
This script interfaces with NVIDIA's KIMI K2.5 API for code generation and execution.
"""

import requests
import json
import sys
import time

# API Configuration
INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
API_KEY = "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"

def call_kimi(prompt, stream=True):
    """
    Call KIMI K2.5 API with the given prompt.
    
    Args:
        prompt (str): The prompt to send to KIMI
        stream (bool): Whether to use streaming mode
    
    Returns:
        str: The response from KIMI
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "text/event-stream" if stream else "application/json"
    }
    
    payload = {
        "model": "moonshotai/kimi-k2.5",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 16384,
        "temperature": 1.00,
        "top_p": 1.00,
        "stream": stream,
        "chat_template_kwargs": {"thinking": True},
    }
    
    try:
        response = requests.post(INVOKE_URL, headers=headers, json=payload, timeout=120)
        
        if stream:
            result = []
            for line in response.iter_lines():
                if line:
                    try:
                        # Parse SSE format
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str.strip() == "[DONE]":
                                break
                            try:
                                data = json.loads(data_str)
                                if "choices" in data and len(data["choices"]) > 0:
                                    delta = data["choices"][0].get("delta", {})
                                    if "content" in delta:
                                        result.append(delta["content"])
                                        print(delta["content"], end="", flush=True)
                            except json.JSONDecodeError:
                                pass
                    except Exception as e:
                        pass
            return "".join(result)
        else:
            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"]
            return ""
            
    except requests.exceptions.Timeout:
        return "ERROR: Request timeout after 120 seconds"
    except requests.exceptions.RequestException as e:
        return f"ERROR: Request failed - {str(e)}"
    except Exception as e:
        return f"ERROR: {str(e)}"

def main():
    """Main entry point for the script."""
    if len(sys.argv) > 1:
        # Read prompt from command line argument
        prompt = " ".join(sys.argv[1:])
    else:
        # Read prompt from stdin
        prompt = sys.stdin.read()
    
    if not prompt.strip():
        print("ERROR: No prompt provided")
        sys.exit(1)
    
    result = call_kimi(prompt, stream=True)
    
    # If not streaming, print the result
    if not result.startswith("ERROR") and not sys.argv[1:]:
        print(result)

if __name__ == "__main__":
    main()
