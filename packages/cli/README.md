# 🧠 gpdevmate CLI — AI Code Review from Terminal

The **gpdevmate CLI** allows developers to run AI-powered code reviews directly from the terminal, using local source files and LLMs like GPT-4 or CodeLlama.

It’s part of the [gpdevmate project](https://github.com/gpmindset/gpdevmate), a portfolio project by [@sgprakas](https://github.com/sgprakas), aiming to build AI tooling for developers.

> ⚠️ **Note:** This is an early preview (`v0.1.0`) — not tested in production environments. Use with caution.

---

## 🚀 Installation

```bash
npm install -g @sgprakas/gpdevmate
```

> You can now run `gpdevmate` from anywhere.

---

## ⚡ Quick Start

1. **Configure the LLM provider (interactive):**

```bash
gpdevmate config --update
```

This will walk you through selecting and setting up your model provider (e.g., OpenAI or Ollama). Passing `--provider` option only will update the default provider. Passing both `--provider` and `--update` will update the default provider and also prompt for config to update.

2. **Run your first review:**

```bash
gpdevmate review ./src --limit 5 --output-format markdown
```

This will review up to 5 files from the `./src` directory and print/save the output in Markdown format.

---


## ⚙️ CLI Usage

```bash
gpdevmate [options] [command]
```

### Available Commands:

| Command           | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `review <target>` | Run code review on a directory or file                         |
| `config`          | Set model provider and its configuration (OpenAI, Ollama, etc) |
| `check`           | Check whether the current model provider is reachable          |
| `help [command]`  | Show help information for a specific command                   |

### Global Options:

| Option          | Description            |
| --------------- | ---------------------- |
| `-V, --version` | Output the CLI version |
| `-h, --help`    | Display help menu      |

---

## 🔍 `review` Command Usage

```bash
gpdevmate review [options] <target>
```

**Arguments:**

| Argument   | Description                     |
| ---------- | ------------------------------- |
| `<target>` | Path to the directory to review |

**Options:**

| Option                                  | Description                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| `--provider <provider>`                 | LLM Provider: `openai` \| `ollama` (default: `openai`)      |
| `--limit <number>`                      | Max number of files to review (default: `5`)                |
| `--skip-dirs <dirs>`                    | Comma-separated list of directories to skip                 |
| `--dry-run`                             | Show which files are going to be reviewed                   |
| `--of, --output-format <output_format>` | Output format: `console` \| `markdown` (default: `console`) |
| `-o, --output <output>`                 | Output directory to save the review as a `.md` file         |
| `-h, --help`                            | Display help for the `review` command                       |

---

## ⚙️ `config` Command Usage

```bash
gpdevmate config [options]
```

**Description:**

Configure and update the default LLM provider and its settings.

**Options:**

| Option                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `--provider <provider>` | Set default LLM Provider: `openai` \| `ollama`        |
| `--update`              | Update configuration values for the selected provider |
| `-h, --help`            | Display help for the `config` command                 |

---

## 🧠 Example Output

```md

File: sample.ts

export async function handleRequest(req, res) {
    const userData = await getUserData(req.params.id)

    if (userData === null) {
        res.send('User not found')
    }
    else {
        res.send(userData)
    }
}

async function getUserData(id) {
    let db = connectToDb()
    let result

    try {
        result = await db.query("SELECT * FROM users WHERE id = " + id)
    } catch (err) {
        console.log(err)
    }

    return result.rows[0]
}

function connectToDb() {
    return {
        async query(sql) {
            return { rows: [{ id: 1, name: "John" }] }
        }
    }
}

Suggestions:
• SQL Injection Risk: The current implementation of `getUserData` is vulnerable to SQL injection. Use parameterized queries to prevent this.
• Error Handling: The error handling in `getUserData` is insufficient. Consider returning a meaningful error response to the client if the database query fails.
• Return Type: Specify the return type for `getUserData` and `handleRequest` functions for better type safety.
• Response Status Codes: Use appropriate HTTP status codes when sending responses (e.g., 404 for "User not found").

Improved Code Example:

export async function handleRequest(req, res) {
    try {
        const userData = await getUserData(req.params.id);
        if (!userData) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(userData);
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getUserData(id: string): Promise<any | null> {
    const db = connectToDb();
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]); // Use parameterized query
        return result.rows[0] || null;
    } catch (err) {
        console.error('Database query error:', err);
        throw new Error('Database query failed');
    }
}

function connectToDb() {
    return {
        async query(sql: string, params: any[]) {
            // Simulate a database query with parameters
            return { rows: [{ id: 1, name: "John" }] };
        }
    };
}
```
---

## 🙋‍♂️ Author

Created by [Gnana Prakash S](https://github.com/sgprakas)
Fullstack dev building AI tools to learn & grow 🚀

