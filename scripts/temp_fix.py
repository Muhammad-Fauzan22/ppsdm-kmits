
# 2. AI AGENT FACTORY
# ==============================================================================

def query_ai(role_key: str, prompt: str, system_prompt: str = "You are a helpful assistant.", json_mode: bool = False) -> str:
    """
    Generic function to query any of the configured AI models.
    """
    config = MODELS[role_key]
    if not config["api_key"]:
        print(f"MISSING {role_key.upper()} API Key!")
        return ""

    client = OpenAI(base_url=config["base_url"], api_key=config["api_key"])
    
    print(f"AI: {config['role']} ({config['id']}) is working...", end="", flush=True)
    
    try:
        completion = client.chat.completions.create(
            model=config["id"],
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7 if not json_mode else 0.1,
            top_p=0.95,
            max_tokens=4096,
            stream=False # For script simplicity we use blocking
        )
        response = completion.choices[0].message.content
        print(" DONE.")
        return response
    except Exception as e:
        print(f" FAILED: {e}")
        return ""
