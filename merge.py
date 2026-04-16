import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    text_stable = f.read()

with open('index_user.html', 'r', encoding='utf-8') as f:
    text_user = f.read()

# 1. Replace <script type="module"> CodeMirror CDN block with ImportMap + Module script from index_user.html
m_head_cm_user = re.search(r'(<!-- CodeMirror 6 for Syntax Highlighting -->.*?)</script>\s*<style>', text_user, re.DOTALL)
m_head_cm_stable = re.search(r'(<!-- CodeMirror 6 for Syntax Highlighting -->.*?)</script>\s*<style>', text_stable, re.DOTALL)
if m_head_cm_user and m_head_cm_stable:
    text_stable = text_stable.replace(m_head_cm_stable.group(1), m_head_cm_user.group(1))

# 2. Add CodeMirror + Ticker Styles
m_styles_user = re.search(r'<style>(.*?)</style>', text_user, re.DOTALL)
m_styles_stable = re.search(r'<style>(.*?)</style>', text_stable, re.DOTALL)
if m_styles_user and m_styles_stable:
    text_stable = text_stable.replace(m_styles_stable.group(1), m_styles_user.group(1))

# 3. Add window.isVisteonUser script
m_script_visteon = re.search(r'(<script>\s*// ── Visteon-only access enforcement.*?)</script>', text_user, re.DOTALL)
if m_script_visteon:
    text_stable = text_stable.replace('</head>', m_script_visteon.group(1) + '</script>\n</head>')

# 4. Update body tag
m_body_user = re.search(r'(<body.*?x-data="labApp\(\)".*?>)', text_user, re.DOTALL)
m_body_stable = re.search(r'(<body.*?x-data="labApp\(\)".*?>)', text_stable, re.DOTALL)
if m_body_stable and m_body_user:
    text_stable = text_stable.replace(m_body_stable.group(1), m_body_user.group(1))

# 5. Extract CodeMirror functions from user JS and add to stable JS
# We look for initCodeMirror() to the end of syncScroll() function
m_js_funcs_user = re.search(r'(initCodeMirror\(\).*?syncScroll\(event\)\s*\{[^{}]*\{[^{}]*\}[^{}]*\})', text_user, re.DOTALL)
if m_js_funcs_user:
    # Inject it before parseErrors
    text_stable = text_stable.replace('parseErrors(compileOutput) {', m_js_funcs_user.group(1) + ',\n\n                parseErrors(compileOutput) {')

# 6. Editor HTML view replacement
# The user replaced the textarea with a div#code-editor.
editor_html_user = re.search(r'(<!-- Editor View -->.*?)(?=<!-- Results View -->)', text_user, re.DOTALL)
editor_html_stable = re.search(r'(<!-- Editor View -->.*?)(?=<!-- Results View -->)', text_stable, re.DOTALL)
if editor_html_user and editor_html_stable:
    text_stable = text_stable.replace(editor_html_stable.group(1), editor_html_user.group(1))

# 7. Add ticker ribbon to login view
ticker_user = re.search(r'(<!-- ── How-To Ticker Ribbon ── -->.*?)<!-- login content centred in remaining space -->', text_user, re.DOTALL)
if ticker_user:
    text_stable = text_stable.replace('<div x-show="!isLoggedIn" class="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">',
                                      '<div x-show="!isLoggedIn" class="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-stretch justify-start">\n' + ticker_user.group(1) + '\n<div class="flex-1 flex items-center justify-center p-4 overflow-y-auto">')
    # add the closing div for the extra flex wrapper
    text_stable = text_stable.replace('<!-- 2. Main Lab Interface -->', '</div>\n    <!-- 2. Main Lab Interface -->')

# 8. Save the merged file
with open('index_merged.html', 'w', encoding='utf-8') as f:
    f.write(text_stable)

print("Merge completed!")
