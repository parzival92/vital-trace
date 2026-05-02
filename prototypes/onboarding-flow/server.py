#!/usr/bin/env python3
"""Local mock server for the VitalTrace onboarding prototype.

This server intentionally uses only the Python standard library. It serves the
React prototype files and exposes small JSON endpoints with anonymized demo data.
It is not production code.
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8765


ONBOARDING_CONFIG = {
    "goals": [
        {
            "id": "red-markers",
            "title": "Understand red markers",
            "description": "Turn abnormal values into clear focus areas without medical advice.",
        },
        {
            "id": "action-loop",
            "title": "Track a 12-week lifestyle phase",
            "description": "Record context, retest, and compare marker movement.",
        },
        {
            "id": "doctor-prep",
            "title": "Prepare for a doctor visit",
            "description": "Bring reviewed trends and focused questions instead of scattered PDFs.",
        },
        {
            "id": "history",
            "title": "Build long-term bloodwork history",
            "description": "Create a source-linked timeline across recurring reports.",
        },
    ],
    "demoProfile": {
        "name": "Arjun Mehta",
        "age": "34",
        "sex": "Male",
        "primaryFocus": "Improve glucose, lipids, and inflammation markers",
    },
}


DEMO_REPORT = {
    "report": {
        "labName": "Demo Diagnostics",
        "reportDate": "2026-01-12",
        "reviewStatus": "needs_review",
        "ocrConfidence": "High",
        "source": "demo-bloodwork-jan-2026.pdf",
    },
    "markers": [
        {
            "id": "hba1c",
            "name": "HbA1c",
            "category": "Glucose control",
            "value": "6.1%",
            "range": "< 5.7%",
            "risk": "red",
            "confidence": "96%",
            "source": "Page 2, table 1, row 8",
            "issue": "Above report range. Candidate focus area.",
        },
        {
            "id": "ldl",
            "name": "LDL-C",
            "category": "Lipids",
            "value": "162 mg/dL",
            "range": "< 100 mg/dL",
            "risk": "red",
            "confidence": "94%",
            "source": "Page 3, lipid panel, row 4",
            "issue": "Above report range. Keep visible for retest.",
        },
        {
            "id": "hscrp",
            "name": "hs-CRP",
            "category": "Inflammation",
            "value": "4.8 mg/L",
            "range": "< 1.0 mg/L",
            "risk": "red",
            "confidence": "91%",
            "source": "Page 5, inflammation, row 2",
            "issue": "Elevated on this report. Interpret with context.",
        },
        {
            "id": "alt",
            "name": "ALT",
            "category": "Liver / metabolic",
            "value": "61 U/L",
            "range": "7-56 U/L",
            "risk": "red",
            "confidence": "95%",
            "source": "Page 4, liver panel, row 3",
            "issue": "Slightly above report range.",
        },
        {
            "id": "vitd",
            "name": "Vitamin D",
            "category": "Deficiency",
            "value": "18 ng/mL",
            "range": "30-100 ng/mL",
            "risk": "amber",
            "confidence": "93%",
            "source": "Page 6, vitamins, row 1",
            "issue": "Below report range. Do not infer dosage.",
        },
        {
            "id": "triglycerides",
            "name": "Triglycerides",
            "category": "Lipids",
            "value": "188 mg/dL",
            "range": "< 150 mg/dL",
            "risk": "amber",
            "confidence": "95%",
            "source": "Page 3, lipid panel, row 7",
            "issue": "Above report range.",
        },
    ],
}


ACTION_LOOP = {
    "score": {
        "baseline": 68,
        "projectedAfterReview": 68,
        "message": "The score stays a draft until the user confirms extracted markers.",
    },
    "focusAreas": [
        {
            "title": "Glucose control",
            "markers": ["HbA1c"],
            "nextStep": "Track lifestyle context and retest with the next bloodwork phase.",
        },
        {
            "title": "Lipids",
            "markers": ["LDL-C", "Triglycerides"],
            "nextStep": "Keep unresolved lipid markers visible and prepare doctor discussion questions.",
        },
        {
            "title": "Inflammation",
            "markers": ["hs-CRP"],
            "nextStep": "Interpret with context such as illness, sleep, training load, and clinician input.",
        },
        {
            "title": "Liver / metabolic",
            "markers": ["ALT"],
            "nextStep": "Track lifestyle context and compare with repeat liver markers.",
        },
    ],
    "retestWindow": "8-12 weeks",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, payload, status=200):
        encoded = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/onboarding-config":
            self.send_json(ONBOARDING_CONFIG)
            return
        if path == "/api/demo-report":
            self.send_json(DEMO_REPORT)
            return
        if path == "/api/action-loop":
            self.send_json(ACTION_LOOP)
            return
        if path == "/":
            self.path = "/index.html"
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_json({"error": "Invalid JSON"}, status=400)
            return

        if path == "/api/onboarding-session":
            self.send_json(
                {
                    "status": "saved",
                    "sessionId": "demo-onboarding-session",
                    "received": body,
                }
            )
            return

        self.send_json({"error": "Not found"}, status=404)


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"VitalTrace onboarding prototype running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
