#!/usr/bin/env node

import readline from "node:readline";

// ANSI styles
const styles = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m"
};

// Read everything coming through stdin
const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

let input = "";

rl.on("line", (line) => {
  input += line + "\n";
});

rl.on("close", () => {
  input = input.trim();

  if (!input) {
    console.error(`${styles.red}dark:${styles.reset} No input received.`);
    console.error(
      `${styles.gray}Example: curl https://example.com | dark${styles.reset}`
    );
    process.exit(1);
  }

  render(input);
});

function render(data) {
  let parsed;

  // Try JSON first
  try {
    parsed = JSON.parse(data);
  } catch {
    parsed = null;
  }

  console.log();
  console.log(
    `${styles.bold}${styles.cyan}◆ darkURL${styles.reset}`
  );
  console.log(
    `${styles.gray}────────────────────────────────────${styles.reset}`
  );

  if (parsed !== null) {
    renderJSON(parsed);
  } else {
    renderText(data);
  }

  console.log(
    `${styles.gray}────────────────────────────────────${styles.reset}`
  );
  console.log();
}

function renderJSON(data) {
  const formatted = JSON.stringify(data, null, 2);

  // Basic JSON syntax highlighting
  const highlighted = formatted
    .replace(
      /("(?:\\.|[^"\\])*")(\s*:)/g,
      `${styles.cyan}$1${styles.reset}$2`
    )
    .replace(
      /("(?:\\.|[^"\\])*")/g,
      `${styles.green}$1${styles.reset}`
    )
    .replace(
      /\b(true|false)\b/g,
      `${styles.yellow}$1${styles.reset}`
    )
    .replace(
      /\b(null)\b/g,
      `${styles.red}$1${styles.reset}`
    )
    .replace(
      /(-?\b\d+(?:\.\d+)?\b)/g,
      `${styles.yellow}$1${styles.reset}`
    );

  console.log(highlighted);
}

function renderText(data) {
  console.log(`${styles.green}${data}${styles.reset}`);
}
