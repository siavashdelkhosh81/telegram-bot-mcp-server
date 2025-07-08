# 🧠 Telegram Bot MCP Server

A powerful **Model Context Protocol (MCP) server** for seamless Telegram Bot API integration with intelligent message splitting, comprehensive error handling, and NPX support.

[![NPM Version](https://img.shields.io/npm/v/telegram-bot-mcp-server)](https://www.npmjs.com/package/telegram-bot-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## ✨ Key Features

- **🔄 Intelligent Message Splitting**: Automatically handles Telegram's 4096 character limit while preserving word boundaries and formatting
- **🛡️ Comprehensive Error Handling**: Detailed error reporting with context, error codes, and debugging information
- **📦 NPX Support**: Run directly with `npx telegram-bot-mcp-server` - no installation required
- **🔧 Easy Integration**: Simple MCP client configuration for AI assistants
- **📝 Rich API Coverage**: Complete Telegram Bot API functionality including messaging, user management, and bot configuration

## 🚀 Quick Start

### Option 1: NPX (Recommended)
```bash
# Run directly without installation
npx telegram-bot-mcp-server
```

### Option 2: NPM Installation
```bash
# Install globally
npm install -g telegram-bot-mcp-server

# Or install locally
npm install telegram-bot-mcp-server
```

## 📋 Prerequisites

1. **Node.js 18+**: [Download here](https://nodejs.org/)
2. **Telegram Bot Token**: Get one from [@BotFather](https://t.me/BotFather)

### Getting Your Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a conversation and run: `/newbot`
3. Follow the prompts to name your bot
4. Copy the API token provided

## 🔧 MCP Client Configuration

Add this configuration to your MCP client (Claude Desktop, etc.):

```json
{
  "mcpServers": {
    "telegram_bot": {
      "command": "npx",
      "args": ["telegram-bot-mcp-server"],
      "env": {
        "TELEGRAM_BOT_API_TOKEN": "your_bot_token_here"
      }
    }
  }
}
```

### Alternative Configurations

**Using global installation:**
```json
{
  "mcpServers": {
    "telegram_bot": {
      "command": "telegram-bot-mcp-server",
      "env": {
        "TELEGRAM_BOT_API_TOKEN": "your_bot_token_here"
      }
    }
  }
}
```

**Using local installation:**
```json
{
  "mcpServers": {
    "telegram_bot": {
      "command": "node",
      "args": ["./node_modules/.bin/telegram-bot-mcp-server"],
      "env": {
        "TELEGRAM_BOT_API_TOKEN": "your_bot_token_here"
      }
    }
  }
}
```

## 🛠️ Available Tools

### 📨 Messaging Tools

#### `send-message`
Send text messages with automatic splitting for long content.
- **Features**: Intelligent message splitting, word boundary preservation
- **Input**: `chatId` (string), `text` (string)
- **Auto-splitting**: Messages over 4096 characters are automatically split

#### `send-photo`
Send photos with captions, handling long captions automatically.
- **Features**: Long caption splitting, multiple message support
- **Input**: `chatId` (string), `media` (string), `text` (optional string)

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

### 👥 User Management Tools

#### `kick-chat-member` / `un-ban-chat-member`
Manage chat members with detailed error reporting.
- **Features**: Ban/unban users, comprehensive error handling
- **Input**: `chatId` (string), `userId` (number)

#### `get-chat` / `get-chat-member` / `get-chat-member-count`
Retrieve detailed chat and member information.
- **Features**: Complete chat data, member details, member counts
- **Input**: `chatId` (string), `userId` (number, for member info)

### 🤖 Bot Configuration Tools

#### `get-me`
Test bot authentication and retrieve bot information.
- **Features**: Authentication validation, bot details
- **Input**: None required

#### `set-my-name` / `get-my-name`
Configure and retrieve bot name.
- **Input**: `name` (string, 0-64 characters)

#### `set-my-description` / `get-my-description`
Configure and retrieve bot description.
- **Input**: `description` (string, 0-512 characters)

#### `set-my-short-description` / `get-my-short-description`
Configure and retrieve bot short description.
- **Input**: `short_description` (string, 0-120 characters)

#### `set-my-commands` / `get-my-commands`
Configure and retrieve bot commands.
- **Input**: `commands` (array of command objects)

## 🆕 New Features

### Intelligent Message Splitting
- **Automatic Detection**: Detects when messages exceed 4096 characters
- **Smart Splitting**: Preserves word boundaries and formatting
- **Sequential Delivery**: Sends parts in order with part indicators
- **Photo Captions**: Handles long photo captions by splitting across messages

### Enhanced Error Handling
- **Detailed Errors**: Includes error codes, descriptions, and context
- **Telegram API Errors**: Captures and formats Telegram-specific errors
- **Network Issues**: Handles connection and timeout errors
- **Debug Information**: Comprehensive logging for troubleshooting

### NPX Support
- **Zero Installation**: Run directly with `npx telegram-bot-mcp-server`
- **CLI Interface**: Built-in help and version commands
- **Environment Validation**: Checks for required bot token
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 🔍 Troubleshooting

### Common Issues

#### "No bot token" Error
```bash
❌ Error: Missing Telegram Bot Token
```
**Solution**: Set the `TELEGRAM_BOT_API_TOKEN` environment variable:
```bash
export TELEGRAM_BOT_API_TOKEN="your_token_here"
npx telegram-bot-mcp-server
```

#### "Something went wrong" Errors (Legacy)
This has been replaced with detailed error messages. Update to the latest version for better error reporting.

#### NPX Command Not Found
**Solution**: Ensure Node.js 18+ is installed:
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be included with Node.js
```

#### Permission Errors
**Solution**: On Unix systems, you may need to use `sudo` for global installation:
```bash
sudo npm install -g telegram-bot-mcp-server
```

### Debug Mode
Set `NODE_ENV=development` for additional debug information:
```bash
NODE_ENV=development npx telegram-bot-mcp-server
```

## 📚 Usage Examples

### Basic Message Sending
```javascript
// Through MCP client
await sendMessage({
  chatId: "@username",
  text: "Hello! This is a test message."
});
```

### Long Message Handling
```javascript
// Messages over 4096 characters are automatically split
await sendMessage({
  chatId: "123456789",
  text: "Very long message content..." // Will be split automatically
});
```

### Photo with Long Caption
```javascript
await sendPhoto({
  chatId: "123456789",
  media: "https://example.com/photo.jpg",
  text: "Very long caption..." // Will be split if needed
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/siavashdelkhosh81/telegram-bot-mcp-server/issues)
- **Telegram API Docs**: [Official Documentation](https://core.telegram.org/bots/api)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.org/)

## ☕ Support the Project

If you find this project helpful, consider supporting the developer:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg)](https://buymeacoffee.com/delkhoshsiv)
