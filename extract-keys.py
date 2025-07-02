#!/usr/bin/env python3
import json
import re

# Read the first few lines to find the main keys
json_file = '/Users/nerveband/wavedepth Dropbox/Ashraf Ali/Mac (2)/Documents/GitHub/tayyab-podcast-landing/acss-old.json'

try:
    with open(json_file, 'r') as f:
        # Read the entire file
        content = f.read()
        
    # Find all main keys using regex
    # Pattern to match top-level keys in JSON
    pattern = r'^\s*"([^"]+)"\s*:\s*[{\[]'
    matches = re.findall(pattern, content, re.MULTILINE)
    
    print("=== MAIN CONFIGURATION CATEGORIES (Extracted from acss-old.json) ===\n")
    
    for i, key in enumerate(matches, 1):
        print(f"{i:2d}. {key}")
    
    print(f"\nTotal main categories found: {len(matches)}")
    
    # Also try to find some patterns for variables
    print("\n=== VARIABLE PATTERNS ANALYSIS ===\n")
    
    # Color patterns
    color_patterns = [
        r'"([^"]*-(?:h|s|l|alpha))"',  # HSL color components
        r'"([^"]*-(?:hover|active|focus))"',  # State variants
        r'"([^"]*-(?:light|dark|medium))"',  # Lightness variants
        r'"([^"]*-(?:primary|secondary|accent|base))"',  # Color roles
    ]
    
    for i, pattern in enumerate(color_patterns):
        matches = re.findall(pattern, content)
        if matches:
            print(f"Pattern {i+1} matches: {len(matches)} found")
            print(f"Sample: {matches[:5]}")
            print()

except Exception as e:
    print(f"Error: {e}")