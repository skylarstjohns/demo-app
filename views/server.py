import socketserver
import json
import http.server
from http.server import SimpleHTTPRequestHandler

PORT = 8000

mock_data = {
    "conditions": [
        {
            "id": 1, 
            "name": "Diabetes", 
            "subCategories": [{"id": "a", "name": "Type 1"}, {"id": "b", "name": "Type 2"}],
            "medications": [{"id": "m1", "name": "Metformin"}, {"id": "m2", "name": "Insulin"}]
        },
        {
            "id": 2, 
            "name": "Hypertension", 
            "subCategories": [{"id": "c", "name": "Primary"}, {"id": "d", "name": "Secondary"}],
            "medications": [{"id": "m3", "name": "Lisinopril"}, {"id": "m4", "name": "Amlodipine"}]
        }
    ]
}

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == "/data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(mock_data).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"Mock server running at http://127.0.0.1:{PORT}")
    httpd.serve_forever()