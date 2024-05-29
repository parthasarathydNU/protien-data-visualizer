import re

def remove_control_characters(s):
    # Remove control characters
    s = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', s)
    # Remove backticks
    s = s.replace('`', '')
    return s
