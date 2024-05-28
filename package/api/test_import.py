# test_import.py
try:
    from databases import Database
    print("Successfully imported 'databases'")
except ImportError as e:
    print("Failed to import 'databases':", str(e))
