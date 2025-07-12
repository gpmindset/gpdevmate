# 🧠 gpdevmate — AI Code Review Agent for GitHub Pull Requests

**gpdevmate** is an AI-powered GitHub bot and CLI tool that automatically reviews pull requests or local code with helpful, structured feedback — just like a senior developer would.

It leverages LLMs to analyze code diffs and leave high-quality review comments directly on your PRs or console *(If you use CLI)*.

---

## ⚠️ Disclaimer

This project has **not been tested in production-level environments**. It is a work-in-progress portfolio project intended for learning and experimentation.

Please **use it cautiously** and manually verify all suggestions made by the AI before applying them to your codebase.

---

## ✨ Features

* 🧠 **LLM-Powered Reviews**
  Provides intelligent feedback on changed logic using open or commercial LLMs.

* ⚡ **Pull Request Bot**
  Integrates with GitHub using [Probot](https://probot.github.io/) to automatically review new PRs.

* 🧼 **CLI Reviews**
  Run AI-powered reviews on your local codebase from the command line — great for CI or offline usage.

* 💬 **Readable, Markdown Feedback**
  Comments are grouped by file and written in clean, professional language.

* 🧠 **Token-Efficient** \
  Automatically skips:
  * Whitespace-only diffs
  * Binary/media files
  * Unchanged or irrelevant files

---

## 🚀 Quick Start

### 🔧 1. Fork & Clone & Install

```bash
git clone https://github.com/yourusername/gpdevmate.git
cd gpdevmate
pnpm install
```

### 🔐 2. Set Environment Variables

Create a `.env` file in the `github-bot` or `cli` package (depending on usage):

```env
APP_ID=github-app-id
PRIVATE_KEY=your-private-key
WEBHOOK_SECRET=your-secret

MODEL_PROVIDER=openai
OPENAI_API_KEY=your-key-here
(optional)OPENAI_BASE_URL=your-base-url
```

> You can use OpenAI or switch to local LLM providers like Ollama *(In future)*.

---

### 🚀 3. Run the GitHub Bot Locally

```bash
pnpm run build:gpdevmate-bot
pnpm run start:gpdevmate-bot
```

> Make sure you’ve set up your GitHub App and forwarded webhooks (e.g., using `smee.io` or `ngrok`).

---

### 🧪 4. Run the CLI Review

> The CLI will scan your project, build a prompt with all files, and output feedback to the console. For more [Check Here](./packages/cli/README.md)

---

## 🤖 How It Works

1. You open a pull request *(or run CLI)*
2. `gpdevmate` fetches the changed files
3. It filters out binary and formatting-only files
4. Builds a single prompt with all relevant changes
5. Sends the prompt to the LLM
6. Posts the review feedback as a PR comment or prints it in the terminal *(If you use CLI)*

---

## 📦 Packages

This monorepo includes:

| Package           | Description                                         |
|-------------------| --------------------------------------------------- |
| `core`            | Code review logic (planning, filtering, LLM client) |
| `apps/github-bot` | Probot app that handles GitHub PR events            |
| `cli`             | Run reviews manually on local projects              |

---

## 💡 Example PR Feedback

```markdown
### `userService.ts`
✅ No suggestions for this file.

### `auth/login.ts`
- Missing input validation for `email`
- Consider hashing passwords before DB insert
```

---

## 🤝 Contributing

Pull requests are welcome. Feel free to open issues or suggest improvements!

---

## 🙋‍♂️ Author

Built by [Gnana Prakash S](https://github.com/sgprakas) —
Fullstack dev learning AI by building real things 🚀
