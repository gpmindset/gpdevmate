# 🧠 gpdevmate — A Simple AI Code Review Agent (CLI + GitHub Bot)

`gpdevmate` is an AI-powered code review tool designed to help developers write better code — whether working locally or contributing through pull requests.

It includes:

* ✨ A **CLI tool** for reviewing your own projects using local or cloud LLMs
* 🤖 A **GitHub App** that automatically reviews pull requests using AI

> 💡 Built to help developers **learn from feedback**, not just generate code blindly.

> ⚠️ **Note:** This is an early preview (`v0.1.x`).  
> While `gpdevmate` provides useful suggestions, they may not always be accurate or context-aware.  
> Use it as a guide — not a source of truth.

> 🚧 In future versions, gpdevmate aims to learn from your codebase  
> to provide more personalized and context-aware reviews.
---

## 📦 Project Structure

| Module                                 | Description                                               |
|----------------------------------------| --------------------------------------------------------- |
| [`packages/cli`](./packages/cli)       | CLI to run code reviews locally from your terminal        |
| [`apps/github-bot`](./apps/github-bot) | GitHub App to post AI-powered code review comments on PRs |
| [`packages/core`](./packages/core)     | Shared internal logic used by both CLI and bot            |

---

## 🚀 Features

* Reviews code using OpenAI / Ollama / Local LLMs
* Token-aware planner: skips large files, third-party libs, etc.
* Dry-run support to preview files before review
* Output as console logs or markdown
* GitHub bot posts contextual suggestions on pull requests
* Extensible core logic for future LLM integrations

---

## 📂 Usage

### 🧑‍💻 CLI Tool

```bash
npm install -g @sgprakas/gpdevmate
gpdevmate config
gpdevmate review ./src --limit 5 --output-format markdown
```

➡️ **Full CLI usage**: [See CLI README →](./packages/cli/README.md)

---

### 🤖 GitHub Bot

The GitHub App reviews pull requests automatically by analyzing code diffs and posting AI-generated feedback as PR comments.

To install and use it:

1. Install the GitHub App (private or self-hosted)
2. Add `.env` and configure the bot with your credentials
3. It will listen to PR events and review changed files using LLMs

➡️ **Full bot setup**: [See GitHub Bot Docs →](./apps/github-bot/README.md)

---

## 🙋‍♂️ Feedback & Contributions

Found a bug or idea?
👉 [Open an issue here](https://github.com/gpmindset/gpdevmate/issues/new/choose)

> Please open an issue before submitting a pull request.

