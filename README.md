# darkURL-cli

«A beautiful terminal viewer for HTTP responses, JSON, headers, and "curl" output.»

"darkURL-cli" turns raw "curl" output into a cleaner, easier-to-read terminal interface.

Instead of staring at plain HTTP responses, pipe them into "dark" and get a formatted response with status information, headers, and readable JSON.

## ✨ Features

- 🎨 Clean terminal UI
- 🚦 Color-coded HTTP response status
- 📋 HTTP header viewer
- 🧩 Pretty-printed JSON responses
- 🌈 Syntax highlighting for JSON
- 🔴 Different colors for "{ }"
- 🟡 Different colors for "[ ]"
- 🔵 Syntax highlighting for JSON values
- ⚡ Simple Unix-style pipe workflow
- 🪶 Lightweight and easy to use

## 📦 Installation

Install globally with npm:
```
npm install -g darkurl-cli
```
After installation, the "dark" command is available globally.

## 🚀 Usage

"darkURL-cli" currently works through the "dark" command and reads HTTP responses from standard input.

### Basic example

```
curl "https://example.com" | dark
```

For HTTP status codes and headers, use "curl -i":

```
curl -i "https://example.com" | dark
```

Example output:
```
◆ darkURL
────────────────────────────────────────
Response Code : 200 Success
OK

Headers
────────────────────────────────────────
content-type: text/html
content-length: 1256
date: Sat, 22 Aug 2026 14:18:23 GMT
────────────────────────────────────────

<!doctype html>
<html>
...
</html>
```

### 🧩 JSON responses

"dark" automatically detects JSON responses and formats them for easier reading.

For example:

curl "https://api.github.com/users/octocat" | dark

A JSON response is displayed with syntax highlighting:

```
◆ darkURL
────────────────────────────────────────
Response Code : 200 Success

{
  "login": "octocat",
  "id": 1,
  "name": "The Octocat",
  "public_repos": 8,
  "site_admin": false
}
```

Different JSON elements are highlighted separately, making large API responses easier to scan.

### 🚦 HTTP status codes

"dark" gives HTTP responses a visual status indicator.

Examples:

```
Response Code : 200 Success

Response Code : 301 Moved Permanently

Response Code : 404 Not Found

Response Code : 500 Internal Server Error
```

This makes it possible to understand the result of a request immediately without searching through the raw response.

### 📋 Headers

When headers are available, "dark" displays them separately from the response body.

Use:
```
curl -i "https://example.com" | dark
```

If no HTTP headers are present, the header section is simply omitted.

## 🔥 Why darkURL?

"curl" is incredibly powerful, but its raw output isn't always the easiest thing to read.

"darkURL-cli" is designed for developers who want to keep using the familiar "curl" workflow while getting a cleaner terminal experience.

curl → dark → readable response

No new API client.
No browser.
No GUI.
Just your terminal.

🛠️ Current status

darkURL-cli is currently an early MVP.

The main interface is intentionally simple:

curl "URL" | dark

More features and improvements are planned as the project develops.

## 🗺️ Roadmap

Possible future improvements include:

- Better HTTP header visualization
- Request information
- More response formats
- XML highlighting
- HTML formatting
- Request timing
- Response size information
- Additional terminal themes
- Interactive response exploration
- More "curl" integration

## 🤝 Contributing

Found a bug or have an idea?

Open an issue or submit a pull request on GitHub.

Contributions, suggestions, and feedback are welcome.

## 📄 License

MIT License.

---

darkURL-cli — make your HTTP responses easier to see. 🌑
