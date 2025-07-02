#!/usr/bin/env python3
import json

# Direct path to the file
json_file = '/Users/nerveband/wavedepth Dropbox/Ashraf Ali/Mac (2)/Documents/GitHub/tayyab-podcast-landing/acss-old.json'

try:
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    print("=== ACSS Configuration Structure Analysis ===\n")
    
    print("MAIN CONFIGURATION CATEGORIES:")
    for key in sorted(data.keys()):
        print(f"• {key}")
    
    print("\n=== DETAILED ANALYSIS ===\n")
    
    # Analyze each main category
    for category, content in data.items():
        print(f"Category: {category}")
        print(f"Type: {type(content).__name__}")
        
        if isinstance(content, dict):
            if len(content) > 0:
                print(f"Sub-categories/properties: {len(content)}")
                # Show first few keys as examples
                sample_keys = list(content.keys())[:5]
                print(f"Sample keys: {sample_keys}")
                if len(content) > 5:
                    print(f"... and {len(content) - 5} more")
        elif isinstance(content, list):
            print(f"Array length: {len(content)}")
            if len(content) > 0:
                print(f"First item type: {type(content[0]).__name__}")
        else:
            print(f"Value: {str(content)[:100]}...")
        
        print("-" * 50)

except FileNotFoundError:
    print(f"File not found: {json_file}")
except json.JSONDecodeError as e:
    print(f"JSON decode error: {e}")
except Exception as e:
    print(f"Error: {e}")