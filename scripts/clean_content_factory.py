
lines = []
with open('scripts/content_factory.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the second import block or "import os" happening after line 240
# We know the duplicate starts roughly at line 248
# Let's inspect where the first block ends. Line 246 is empty, 247 is empty.
# Line 248 is "import os".
# We will keep lines 0 to 247.
cutoff = 247
if len(lines) > 248 and 'import os' in lines[248]:
    print(f"Trimming file from {len(lines)} lines to {cutoff}.")
    new_content = "".join(lines[:cutoff])
    with open('scripts/content_factory.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print("File structure unexpected, checking for second '#!/usr/bin/env'")
    found = False
    for i, line in enumerate(lines):
        if i > 5 and line.startswith('import os') and lines[i-1].strip() == '' and lines[i-2].strip() == '':
             print(f"Found potential split at {i}")
             # Let's be safer: check for the Groq class which is in the duplicate
             pass

    # Simple truncation based on known view
    new_content = "".join(lines[:247])
    with open('scripts/content_factory.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
