from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs


from hello import lambda_handler


class handler(BaseHTTPRequestHandler):
    cached_response = {}

    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "OPTIONS,POST,GET")
        self.send_header("Content-type", "application/json")
        self.end_headers()

        print(parse_qs(urlparse(self.path).query))
        start_date = parse_qs(urlparse(self.path).query)["start_date"][0]
        historical = parse_qs(urlparse(self.path).query)["historical"][0]

        if handler.cached_response.get(start_date) == None:
            event = {
                "queryStringParameters": {
                    "start_date": start_date,
                    "historical": historical,
                }
            }
            handler.cached_response[start_date] = lambda_handler(event, {})["body"]

        self.wfile.write(bytes(handler.cached_response[start_date], "utf8"))


with HTTPServer(("", 8000), handler) as server:
    server.serve_forever()
