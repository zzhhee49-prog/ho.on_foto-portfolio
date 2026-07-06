import re

def check_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check simple tag balance
    tags = re.findall(r'<(/?[a-zA-Z0-9]+)[^>]*>', content)
    stack = []
    ignored = {'img', 'br', 'hr', 'input', 'link', 'meta', 'rect', 'line', 'polyline', 'circle', 'path', 'svg', 'rect', 'col'}
    for t in tags:
        t = t.lower()
        if t.startswith('/'):
            close_tag = t[1:]
            if close_tag in ignored:
                continue
            if not stack:
                print(f"HTML error: closed tag </{close_tag}> but stack is empty")
                return False
            last = stack.pop()
            if last != close_tag:
                print(f"HTML mismatch: opened <{last}> but closed </{close_tag}>")
                return False
        else:
            if t in ignored:
                continue
            stack.append(t)
    if stack:
        print(f"HTML error: unclosed tags {stack}")
        return False
    print("HTML syntax is balanced.")
    return True

def check_css(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check braces balance
    braces = 0
    line_no = 1
    col_no = 1
    for char in content:
        if char == '\n':
            line_no += 1
            col_no = 1
        else:
            col_no += 1
            
        if char == '{':
            braces += 1
        elif char == '}':
            braces -= 1
            if braces < 0:
                print(f"CSS error: extra close brace at line {line_no}, col {col_no}")
                return False
    if braces != 0:
        print(f"CSS error: unclosed braces (count={braces})")
        return False
    print("CSS braces are balanced.")
    return True

if __name__ == "__main__":
    check_html("index.html")
    check_css("style.css")
