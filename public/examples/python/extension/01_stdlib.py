# Python Extension: Standard Library

import math
import datetime
import json

# Math
print("Pi:", math.pi)
print("Sqrt of 16:", math.sqrt(16))

# Datetime
now = datetime.datetime.now()
print("Current time:", now.strftime("%Y-%m-%d %H:%M:%S"))

# JSON
data = {"status": "OK", "id": 123}
json_str = json.dumps(data)
print("JSON String:", json_str)
parsed = json.loads(json_str)
print("Parsed ID:", parsed["id"])
