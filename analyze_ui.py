import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
css_dir = 'css'
css_files = [os.path.join(css_dir, f) for f in os.listdir(css_dir) if f.endswith('.css')] if os.path.exists(css_dir) else []

issues = []
missing_images = set()

# 1. Check HTML files
for hf in html_files:
    with open(hf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        if '<meta name="viewport"' not in content.lower():
            issues.append(f"{hf}: Missing viewport meta tag")
        
        # Check for missing images
        images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content, re.IGNORECASE)
        for img in images:
            img_path = img.split('?')[0]
            if img_path.startswith('http') or img_path.startswith('data:'):
                continue
            if not os.path.exists(img_path):
                missing_images.add(img_path)

if missing_images:
    issues.append("MISSING IMAGES:")
    for mi in missing_images:
        issues.append(f" - {mi}")

# 2. Check CSS files
for cf in css_files:
    with open(cf, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        if '@media' not in content:
            issues.append(f"{cf}: No media queries found.")

print("ISSUES FOUND:")
for issue in issues:
    print(issue)
if not issues:
    print("No obvious missing viewport/image issues found.")
