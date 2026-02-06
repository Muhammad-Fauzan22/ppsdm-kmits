import os 
 
os.makedirs('src/lib', exist_ok=True) 
os.makedirs('src/components/performance', exist_ok=True) 
 
c = '''"use client";''' 
with open('src/lib/performance-monitoring.ts', 'w', encoding='utf-8') as f: 
    f.write(c) 
