import os
if "NVIDIA_API_KEY" in os.environ:
    print("Key is set")
else:
    print("Key is NOT set")
