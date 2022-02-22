from http.server import BaseHTTPRequestHandler, HTTPServer

from hello import lambda_handler


class handler(BaseHTTPRequestHandler):
    cached_response = None

    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'OPTIONS,POST,GET')
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        if handler.cached_response == None:
            handler.cached_response = lambda_handler({}, {})['body']

        self.wfile.write(bytes(handler.cached_response, "utf8"))


with HTTPServer(('', 8000), handler) as server:
    server.serve_forever()
