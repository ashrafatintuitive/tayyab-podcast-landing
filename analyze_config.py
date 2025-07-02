#!/usr/bin/env python3
import json
import sys

def analyze_config_differences():
    try:
        # Load the files
        with open('acss-old.json', 'r') as f:
            old_config = json.load(f)
        
        with open('style-config.json', 'r') as f:
            current_config = json.load(f)
        
        # Find missing keys
        missing_keys = set(old_config.keys()) - set(current_config.keys())
        
        # Categorize missing keys 
        categories = {
            'form': [],
            'typography': [],
            'spacing': [],
            'animation': [],
            'layout': [],
            'state': [],
            'other': []
        }
        
        for key in missing_keys:
            value = old_config[key]
            
            # Form-related patterns
            form_patterns = ['input', 'label', 'select', 'textarea', 'checkbox', 'radio', 'form', 'field', 'f-']
            if any(pattern in key.lower() for pattern in form_patterns):
                categories['form'].append((key, value))
            
            # Typography patterns
            typography_patterns = ['font', 'text', 'heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lh', 'scale', 'size', 'weight', 'family']
            elif any(pattern in key.lower() for pattern in typography_patterns):
                categories['typography'].append((key, value))
            
            # Spacing patterns  
            spacing_patterns = ['space', 'gap', 'padding', 'margin', 'indent']
            elif any(pattern in key.lower() for pattern in spacing_patterns):
                categories['spacing'].append((key, value))
            
            # Animation patterns
            animation_patterns = ['animation', 'transition', 'duration', 'timing', 'ease', 'delay']
            elif any(pattern in key.lower() for pattern in animation_patterns):
                categories['animation'].append((key, value))
            
            # Layout patterns
            layout_patterns = ['container', 'grid', 'flex', 'layout', 'width', 'height', 'max-', 'min-']
            elif any(pattern in key.lower() for pattern in layout_patterns):
                categories['layout'].append((key, value))
            
            # State patterns
            state_patterns = ['focus', 'hover', 'active', 'disabled', 'visited', 'checked', 'invalid', 'valid']
            elif any(pattern in key.lower() for pattern in state_patterns):
                categories['state'].append((key, value))
            
            else:
                categories['other'].append((key, value))
        
        # Print results
        print("MISSING CONFIGURATION SECTIONS FROM acss-old.json")
        print("="*60)
        
        for category, items in categories.items():
            if items:
                print(f'\n## {category.upper()} VARIABLES ({len(items)} items)')
                print('```json')
                for key, value in sorted(items):
                    print(f'  "{key}": "{value}",')
                print('```')
        
        print(f"\nTOTAL MISSING VARIABLES: {len(missing_keys)}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    analyze_config_differences()