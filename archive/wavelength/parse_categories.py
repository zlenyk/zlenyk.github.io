#!/usr/bin/env python3
import re

def extract_category_pair(text):
    """Convert a category description to an opposing pair"""
    text = text.strip()
    
    # Remove leading numbers
    text = re.sub(r'^\d+\s+', '', text)
    
    # Pattern matching
    if 'least to most powerful' in text or 'weakest to strongest' in text:
        return 'Weak, Strong'
    elif 'easiest to hardest' in text:
        return 'Easy, Hard'
    elif 'poorest to richest' in text:
        return 'Poor, Rich'
    elif 'most to least common' in text:
        return 'Rare, Common'
    elif 'least to most likely' in text or 'most to least likely' in text:
        return 'Unlikely, Likely'
    elif 'most normal to strangest' in text:
        return 'Normal, Strange'
    elif 'worst to best' in text.lower():
        # Extract the main subject
        match = re.search(r'worst to best\s+([^,\.]+?)(?:\s+(?:to|from|if|that|you|which|when|where|at|in|on|for|with|while|during|after|before)|$)', text, re.IGNORECASE)
        if match:
            subject = match.group(1).strip()
            # Clean up
            subject = re.sub(r'\s+(?:to|from|if|that|you|which|when|where|at|in|on|for|with|while|during|after|before).*$', '', subject, flags=re.IGNORECASE)
            if len(subject) <= 25 and subject:
                return f'Worst {subject.title()}, Best {subject.title()}'
        return 'Worst, Best'
    elif 'least to most' in text.lower():
        match = re.search(r'least to most\s+([^,\.]+?)(?:\s+(?:to|from|if|that|you|which|when|where|at|in|on|for|with|while|during|after|before)|$)', text, re.IGNORECASE)
        if match:
            quality = match.group(1).strip()
            quality = re.sub(r'\s+(?:to|from|if|that|you|which|when|where|at|in|on|for|with|while|during|after|before).*$', '', quality, flags=re.IGNORECASE)
            if len(quality) <= 25 and quality:
                return f'Least {quality.title()}, Most {quality.title()}'
        return 'Least, Most'
    elif 'best to worst' in text.lower():
        match = re.search(r'best to worst\s+([^,\.]+?)(?:\s+(?:to|from|if|that|you|which|when|where|at|in|on|for|with|while|during|after|before)|$)', text, re.IGNORECASE)
        if match:
            subject = match.group(1).strip()
            subject = re.sub(r'\s+(?:to|from|if|that|you|which|when|where|at|in|on|for|with|while|during|after|before).*$', '', subject, flags=re.IGNORECASE)
            if len(subject) <= 25 and subject:
                return f'Best {subject.title()}, Worst {subject.title()}'
        return 'Best, Worst'
    
    return None

# Read file
with open('categories_unparsed.txt', 'r') as f:
    content = f.read()

# Parse entries - handle multi-line
entries = []
current = ''
for line in content.split('\n'):
    line = line.strip()
    
    # Skip headers and empty lines
    if not line or line == 'CATEGORIES NSFW' or line == 'Number Category' or line == 'ages':
        if current:
            entries.append(current)
            current = ''
        continue
    
    # Check if new numbered entry
    if re.match(r'^\d+\s+', line):
        if current:
            entries.append(current)
        current = line
    elif current:
        current += ' ' + line
    elif line and not line.startswith('CATEGORIES'):
        current = line

if current:
    entries.append(current)

# Convert to pairs
pairs = []
for entry in entries:
    pair = extract_category_pair(entry)
    if pair:
        pairs.append(pair)

# Write output
with open('categories_new.txt', 'w') as f:
    for pair in pairs:
        f.write(pair + '\n')

print(f"Created categories_new.txt with {len(pairs)} categories")
print("\nSample (first 15):")
for i, pair in enumerate(pairs[:15], 1):
    print(f"{i}. {pair}")

