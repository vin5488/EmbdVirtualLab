import re

with open('index_user.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('async downloadAllReports()')
if idx != -1:
    brace_count = 0
    in_func = False
    end_idx = idx
    for i in range(idx, len(text)):
        if text[i] == '{':
            if not in_func:
                in_func = True
            brace_count += 1
        elif text[i] == '}':
            if in_func:
                brace_count -= 1
                if brace_count == 0:
                    end_idx = i + 1
                    break
    
    with open('user_report.js', 'w', encoding='utf-8') as f:
        f.write(text[idx:end_idx])
