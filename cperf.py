import os  
os.makedirs('src/lib', exist_ok=True)  
os.makedirs('src/components/performance', exist_ok=True)  
code = '''"use client";'''  
with open('src/lib/performance-monitoring.ts', 'w') as f:  
    f.write(code)  
