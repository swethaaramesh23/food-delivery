import os
import glob
import re

base_dir = r"c:\Users\SWETHA\Desktop\Real estate- login"

# 1. Update index.html and signup.html for email validation
def update_email_validation(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Change type="text" to type="email" and add pattern if not exists
    # index.html has: <input type="text" id="email" placeholder="e.g. buyer@realty.com" required>
    # signup.html has: <input type="email" id="email" placeholder="example@domain.com" required>
    
    content = re.sub(r'<input\s+type="text"\s+id="email"', r'<input type="email" id="email"', content)
    
    # Add pattern to any email input if it doesn't have it
    def add_pattern(match):
        m = match.group(0)
        if 'pattern=' not in m:
            m = m.replace('required', r'pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}" required')
        return m
    
    content = re.sub(r'<input[^>]*id="email"[^>]*>', add_pattern, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_email_validation(os.path.join(base_dir, 'index.html'))
update_email_validation(os.path.join(base_dir, 'signup.html'))

# 2. In dashboard pages, make all buttons link to 404.html and replace unsplash images
dashboard_files = glob.glob(os.path.join(base_dir, '*_dashboard.html'))

for db in dashboard_files:
    with open(db, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace unsplash images with assets/1.webp, assets/2.webp, etc.
    unsplash_urls = re.findall(r'src="(https://images\.unsplash\.com/[^"]+)"', content)
    for i, url in enumerate(set(unsplash_urls)):
        asset_img = f"assets/{i%5 + 1}.webp"
        content = content.replace(url, asset_img)

    # Link buttons to 404.html by appending JS script at the end of body
    js_code = """
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll("button, a.btn, a[class*='btn']").forEach(el => {
                if (!el.classList.contains('hamburger')) {
                    if(el.tagName === 'A') {
                        el.href = '404.html';
                    } else {
                        el.onclick = (e) => {
                            e.preventDefault();
                            window.location.href = '404.html';
                        };
                    }
                }
            });
        });
    </script>
</body>"""
    if "<!-- Button linker added by script -->" not in content:
        content = content.replace("</body>", "    <!-- Button linker added by script -->" + js_code)

    with open(db, 'w', encoding='utf-8') as f:
        f.write(content)

# 3. Move images to assets folder and update references
images_to_move = ['blue logo.webp', 'bg.webp', 'log.webp']
import shutil
for img in images_to_move:
    src = os.path.join(base_dir, img)
    dst = os.path.join(base_dir, 'assets', img)
    if os.path.exists(src):
        shutil.move(src, dst)

# Update all html files to point to assets/img
html_files = glob.glob(os.path.join(base_dir, '*.html'))
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for img in images_to_move:
        # replace src="img" with src="assets/img"
        content = re.sub(rf'src="{img}"', f'src="assets/{img}"', content)
        # replace url('img') with url('assets/img')
        content = re.sub(rf"url\('{img}'\)", f"url('assets/{img}')", content)
        # unquoted url
        content = re.sub(rf"url\({img}\)", f"url(assets/{img})", content)
        
    with open(hf, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
