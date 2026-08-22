#!/usr/bin/env node

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

// UI colors
const COLORS = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m"
};

// JSON syntax colors
const JSON_COLORS = {
  curly: COLORS.red,
  square: COLORS.yellow,
  round: COLORS.blue,
  key: COLORS.cyan,
  string: COLORS.green,
  number: COLORS.yellow,
  boolean: COLORS.magenta,
  null: COLORS.gray
};

let input = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", chunk => {
  input += chunk;
});

process.stdin.on("end", () => {
  input = input.trim();

  if (!input) {
    console.error(
      `${COLORS.red}dark:${RESET} No response received.`
    );

    console.error(
      `${DIM}Try: curl -i https://example.com | dark${RESET}`
    );

    process.exit(1);
  }

  main(input);
});

function main(raw) {
  const response = parseResponse(raw);

  printHeader(response);

  if (isJSON(response.body)) {
    printJSON(JSON.parse(response.body));
  } else {
    printText(response.body);
  }

  console.log();
}

function parseResponse(raw) {
  let statusCode = null;
  let statusText = null;
  let body = raw;
  let headers = [];

  const statusMatch = raw.match(
    /^HTTP\/(?:1\.[01]|2)\s+(\d{3})\s+([^\r\n]+)/
  );

  if (statusMatch) {
    statusCode = Number(statusMatch[1]);
    statusText = statusMatch[2].trim();

    const separatorMatch = raw.match(/\r?\n\r?\n/);

    if (separatorMatch) {
      const separatorIndex = separatorMatch.index;

      // Everything between status line and blank line = headers
      const headerText = raw.slice(
        statusMatch[0].length,
        separatorIndex
      ).trim();

      headers = headerText
        .split(/\r?\n/)
        .filter(line => line.includes(":"))
        .map(line => {
          const index = line.indexOf(":");

          return {
            key: line.slice(0, index).trim(),
            value: line.slice(index + 1).trim()
          };
        });

      // Everything after blank line = body
      body = raw.slice(
        separatorIndex + separatorMatch[0].length
      );
    }
  }

  return {
    statusCode,
    statusText,
    headers,
    body: body.trim()
  };
}
function printHeader(response) {
  console.log();

  console.log(
    `${BOLD}${COLORS.cyan}◆ darkURL${RESET}`
  );

  console.log(
    `${COLORS.gray}────────────────────────────────────────${RESET}`
  );

  if (response.statusCode) {
    const color = getStatusColor(response.statusCode);
    const message = getStatusMessage(response.statusCode);

    console.log(
      `${BOLD}Response Code : ${color}${response.statusCode} ${message}${RESET}`
    );

    console.log(
      `${DIM}${response.statusText}${RESET}`
    );
  }

  // Show headers only when available
  if (response.headers && response.headers.length > 0) {
    console.log();

    console.log(
      `${BOLD}${COLORS.blue}Headers${RESET}`
    );

    console.log(
      `${COLORS.gray}────────────────────────────────────────${RESET}`
    );

    for (const header of response.headers) {
      console.log(
        `${BOLD}${COLORS.cyan}${header.key}${RESET}: ${COLORS.white}${header.value}${RESET}`
      );
    }
  }

  console.log(
    `${COLORS.gray}────────────────────────────────────────${RESET}`
  );

  console.log();
}
function getStatusColor(code) {
  if (code >= 200 && code < 300) return COLORS.green;
  if (code >= 300 && code < 400) return COLORS.yellow;
  if (code >= 400 && code < 500) return COLORS.magenta;
  if (code >= 500) return COLORS.red;

  return COLORS.white;
}

function getStatusMessage(code) {
  const messages = {
    200: "Success",
    201: "Created",
    202: "Accepted",
    204: "No Content",

    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    307: "Temporary Redirect",
    308: "Permanent Redirect",

    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    408: "Request Timeout",
    409: "Conflict",
    429: "Too Many Requests",

    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout"
  };

  return messages[code] || "HTTP Response";
}

function isJSON(value) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

function printJSON(value) {
  const json = JSON.stringify(value, null, 2);

  console.log(highlightJSON(json));
}

function highlightJSON(json) {
  let output = "";
  let i = 0;

  while (i < json.length) {
    const char = json[i];

    // Strings
    if (char === '"') {
      let end = i + 1;

      while (end < json.length) {
        if (
          json[end] === '"' &&
          json[end - 1] !== "\\"
        ) {
          break;
        }

        end++;
      }

      const token = json.slice(i, end + 1);

      // Determine whether this string is a JSON key
      let next = end + 1;

      while (
        next < json.length &&
        /\s/.test(json[next])
      ) {
        next++;
      }

      if (json[next] === ":") {
        output +=
          `${BOLD}${JSON_COLORS.key}${token}${RESET}`;
      } else {
        output +=
          `${JSON_COLORS.string}${token}${RESET}`;
      }

      i = end + 1;
      continue;
    }

    // Curly brackets
    if (char === "{" || char === "}") {
      output +=
        `${BOLD}${JSON_COLORS.curly}${char}${RESET}`;

      i++;
      continue;
    }

    // Square brackets
    if (char === "[" || char === "]") {
      output +=
        `${BOLD}${JSON_COLORS.square}${char}${RESET}`;

      i++;
      continue;
    }

    // Numbers
    if (/[0-9-]/.test(char)) {
      const match = json
        .slice(i)
        .match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);

      if (match) {
        output +=
          `${JSON_COLORS.number}${match[0]}${RESET}`;

        i += match[0].length;
        continue;
      }
    }

    // true / false
    if (
      json.startsWith("true", i) ||
      json.startsWith("false", i)
    ) {
      const value =
        json.startsWith("true", i)
          ? "true"
          : "false";

      output +=
        `${JSON_COLORS.boolean}${value}${RESET}`;

      i += value.length;
      continue;
    }

    // null
    if (json.startsWith("null", i)) {
      output +=
        `${JSON_COLORS.null}null${RESET}`;

      i += 4;
      continue;
    }

    output += char;
    i++;
  }

  return output;
}

function printText(text) {
  console.log(
    `${COLORS.white}${text}${RESET}`
  );
    }
