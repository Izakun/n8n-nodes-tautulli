<img src="nodes/Tautulli/tautulli.svg" width="90" align="right" alt="Tautulli" />

# n8n-nodes-tautulli

[![npm version](https://img.shields.io/npm/v/n8n-nodes-tautulli.svg)](https://www.npmjs.com/package/n8n-nodes-tautulli)
[![License: MIT](https://img.shields.io/npm/l/n8n-nodes-tautulli.svg)](./LICENSE)

Community node for n8n to query a [Tautulli](https://tautulli.com/) Plex monitoring
server through its **v2 API**.

## Installation

In n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-tautulli`.

## Operations

| Operation | Tautulli command |
|---|---|
| Get Activity | `get_activity` |
| Get History | `get_history` |
| Get Home Stats | `get_home_stats` |
| Get Libraries | `get_libraries` |
| Get Users | `get_users` |
| Get Server Info | `get_server_info` |

The node unwraps Tautulli's `response.data` envelope automatically.

## Credentials

Create a **Tautulli API** credential:
- **Base URL** — e.g. `http://tautulli:8181`.
- **API Key** — Tautulli → Settings → Web Interface → API Key. Sent as the `apikey` query parameter.

## Disclaimer

This project isn't affiliated with or endorsed by the Tautulli project. Tautulli is the
property of its respective authors.
