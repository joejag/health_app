from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs


from health import lambda_handler


class handler(BaseHTTPRequestHandler):
    cached_response = {}

    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "OPTIONS,POST,GET")
        self.send_header("Content-type", "application/json")
        self.end_headers()

        if self.path == "/favicon.ico":
            return

        query_params = parse_qs(urlparse(self.path).query)
        clean_qps = {}
        for key, value in query_params.items():
            clean_qps[key] = value[0]

        cache_key = self.path
        if handler.cached_response.get(cache_key) == None:
            event = {"queryStringParameters": clean_qps}
            handler.cached_response[cache_key] = lambda_handler(event, {})["body"]

        self.wfile.write(bytes(handler.cached_response[cache_key], "utf8"))


with HTTPServer(("", 8000), handler) as server:
    server.serve_forever()
