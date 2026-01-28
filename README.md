# Lux Mundi — Eucharistic Exposition Map Demo

This repository contains a static demo for a global map of Eucharistic exposition. It renders a reverent 3D globe, highlights churches where exposition is active, and provides a minimal UI flow for schedule viewing and correction suggestions.

## Run locally

1. Start a local web server from the repo root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

2. Open the demo in your browser:

```
http://127.0.0.1:8000
```

### Troubleshooting

- If you see “This site can’t be reached,” make sure the server command is still running in your terminal.
- If port 8000 is in use, change the port (for example `python3 -m http.server 8080 --bind 127.0.0.1`) and open the matching URL.
