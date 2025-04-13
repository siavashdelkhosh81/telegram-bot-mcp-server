# 🧠 Telegram Bot MCP Server

This project is a **Telegram bot integration** built using the [Model Context Protocol (MCP)](https://modelcontextprotocol.org/) that exposes a suite of useful tools for interacting with the Telegram Bot API. It enables standardized communication with Telegram via a structured set of commands such as messaging, user management, and bot profile configuration.

---

## 🚀 Features

This MCP server exposes the following tools:

### ✅ `get-me`

Test your bot's authentication and retrieve basic information about the bot.

---

### 💬 `send-message`

Send a plain text message to a specific user or chat.

- **Input**:
  - `chatId`: Target chat ID or username
  - `text`: Message content

---

### 🖼️ `send-photo`

Send a photo with an optional caption.

- **Input**:
  - `chatId`: Target chat ID or username
  - `media`: File ID, URL, or uploaded file
  - `text` (optional): Caption for the photo

---

### 🔨 `kick-chat-member`

Ban a user from a group, supergroup, or channel.

- **Input**:
  - `chatId`: Target chat
  - `userId`: User to ban

---

### ♻️ `un-ban-chat-member`

Unban a previously banned user from a chat.

- **Input**:
  - `chatId`: Target chat
  - `userId`: User to unban

---

### 🧾 `get-chat`

Fetch full chat metadata and details.

- **Input**:
  - `chatId`: Target chat

---

### 👥 `get-chat-member-count`

Get the total number of members in a group or channel.

- **Input**:
  - `chatId`: Target chat

---

### 🔍 `get-chat-member`

Get detailed info about a specific member in a group or channel.

- **Input**:
  - `chatId`: Target chat
  - `userId`: Target user

---

### ✏️ `set-my-short-description`

Update your bot's short description (shown in the profile and shares).

- **Input**:
  - `short_description`: New short description (max 120 chars)

---

### 📄 `get-my-short-description`

Fetch the current short description of the bot.

---

### 📝 `set-my-commands`

Set the list of commands that appear in the Telegram UI.

- **Input**:
  - `commands`: Array of `{ command, description }`

---

### 📋 `get-my-commands`

Get the current list of commands configured for the bot.

---

### 🧑‍💻 `set-my-name`

Update the name of the bot.

- **Input**:
  - `name`: New bot name

---

### 🙋 `get-my-name`

Retrieve the current name of the bot.

---

### 📘 `set-my-description`

Update the full description of the bot (shown in empty chats).

- **Input**:
  - `description`: New bot description (max 512 chars)

---

### 📖 `get-my-description`

Fetch the current description of the bot.

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/siavashdelkhosh81/telegram-bot-mcp-server.git
cd telegram-bot-mcp-server
```

---

### 2. Get Your Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Start a conversation and run the command:
   ```
   /newbot
   ```
3. Follow the prompts to name your bot and get your **API token**.
4. Save the token.

---

### 3. Install and build

Install packages

```bash
yarn
```

Build packages

```bash
yarn build
```

---

### 4. Configure Your MCP Client

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "telegram_bot": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/PARENT/FOLDER/.build/index.js"],
      "env": {
        "TELEGRAM_BOT_API_TOKEN": "your bot token"
      }
    }
  }
}
```

> 🔁 Replace `/ABSOLUTE/PATH/TO/PARENT/FOLDER/.build/index.js` with the real path to your compiled project entry point.

---

## 💬 Support & Feedback

Feel free to open issues or contribute to the project. For Telegram-specific help, refer to the [Telegram Bot API documentation](https://core.telegram.org/bots/api).

Buy me a Coffee :) https://buymeacoffee.com/delkhoshsiv

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
