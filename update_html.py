import os
import re
import glob

def process_html_files():
    files = glob.glob('*.html')
    
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Add AOS CSS in head if not present
        if 'aos.css' not in content:
            content = content.replace('</head>', '    <!-- AOS Animation -->\n    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />\n</head>')

        # 2. Add AOS JS before body if not present
        if 'aos.js' not in content:
            aos_script = """    <!-- AOS Animation Script -->
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: true, offset: 50 });
            }
        });
    </script>
</body>"""
            content = content.replace('</body>', aos_script)

        # 3. Add loading="lazy" and onerror to images
        # We find all <img ...> tags.
        def img_replacer(match):
            img_tag = match.group(0)
            # Skip if it already has loading="lazy"
            if 'loading="lazy"' not in img_tag and 'hero' not in img_tag and 'logo' not in img_tag:
                img_tag = img_tag.replace('<img ', '<img loading="lazy" ')
            
            # Add onerror fallback if not present
            if 'onerror=' not in img_tag:
                img_tag = img_tag.replace('<img ', '<img onerror="this.src=\'image/fallback.webp\'; this.onerror=null;" ')
                
            return img_tag

        content = re.sub(r'<img [^>]+>', img_replacer, content)

        # 4. Add social icons to footer if it's a footer tag
        if 'class="footer"' in content and 'footer-socials' not in content:
            social_html = """
                    <div class="footer-socials" style="margin-top: 15px;">
                        <a href="#" class="social-icon" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" class="social-icon" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#" class="social-icon" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    </div>"""
            # Inject after footer-desc if exists
            content = content.replace('</p>\n                </div>\n                <div class="footer-col">', '</p>' + social_html + '\n                </div>\n                <div class="footer-col">')

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print(f"Processed {len(files)} HTML files.")

if __name__ == "__main__":
    process_html_files()
