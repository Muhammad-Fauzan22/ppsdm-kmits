import requests, base64, sys, json

# Force UTF-8 for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')


# API Key Konfigurasi
API_KEY = "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"
INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

def chat_loop():
    print("\033[1;32m🚀 KIMI K2.5 TERMINAL LINK ESTABLISHED\033[0m")
    print("\033[90mType 'exit' to disconnect.\033[0m\n")

    history = []

    while True:
        try:
            # Check if interactive terminal, otherwise simple input
            if sys.stdin.isatty():
                user_input = input("\033[1;36mYou ➜ \033[0m")
            else:
                # Fallback for non-interactive environments (like Agent runner)
                print("\033[1;36mYou ➜ \033[0m", end="")
                user_input = sys.stdin.readline().strip()
                print(user_input) # Echo input

            if user_input.lower() in ['exit', 'quit', '']:
                break
            
            history.append({"role": "user", "content": user_input})

            headers = {
                "Authorization": f"Bearer {API_KEY}",
                "Accept": "text/event-stream",
                "Content-Type": "application/json"
            }

            payload = {
                "model": "moonshotai/kimi-k2.5",
                "messages": history,
                "max_tokens": 16384,
                "temperature": 0.7,
                "top_p": 1.00,
                "stream": True
            }

            print("\033[1;35mKimi ⚡ \033[0m", end="", flush=True)
            
            try:
                response = requests.post(INVOKE_URL, headers=headers, json=payload, stream=True)
                full_response = ""

                for line in response.iter_lines():
                    if line:
                        decoded = line.decode("utf-8")
                        if decoded.startswith("data: "):
                            try:
                                data = json.loads(decoded[6:])
                                if "choices" in data and len(data["choices"]) > 0:
                                    delta = data["choices"][0].get("delta", {})
                                    content = delta.get("content", "")
                                    if content:
                                        print(content, end="", flush=True)
                                        full_response += content
                            except:
                                pass
                
                print("\n")
                history.append({"role": "assistant", "content": full_response})
            except Exception as e:
                print(f"\n\033[91mError: {e}\033[0m")

        except KeyboardInterrupt:
            print("\n\033[91mDisconnected.\033[0m")
            break

if __name__ == "__main__":
    chat_loop()
