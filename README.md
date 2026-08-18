# 🧠 Telegram Bot MCP Server

A powerful **Model Context Protocol (MCP) server** for seamless Telegram Bot API integration with intelligent message splitting, comprehensive error handling, and NPX support.

[![NPM Version](https://img.shields.io/npm/v/telegram-bot-mcp-server)](https://www.npmjs.com/package/telegram-bot-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## ✨ Key Features

- **📝 45 Tools, Rich API Coverage**: Messaging, media, polls, chat administration, invite links, and bot configuration
- **🔄 Intelligent Message Splitting**: Automatically handles Telegram's 4096 character limit while preserving word boundaries and formatting
- **🖼️ Full Media Support**: Photos, documents, videos, audio, voice messages, animations, and stickers by file_id or URL
- **🎲 Interactive Content**: Polls, quizzes, dice, locations, contacts, and chat actions (typing indicators)
- **✏️ Message Lifecycle**: Edit, delete, forward, copy, and pin messages
- **👮 Group Administration**: Ban/unban, restrict/mute, promote admins, and manage invite links
- **🛡️ Comprehensive Error Handling**: Detailed error reporting with context, error codes, and debugging information
- **📦 NPX Support**: Run directly with `npx telegram-bot-mcp-server` - no installation required
- **🔧 Easy Integration**: Simple MCP client configuration for AI assistants

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

## 🛠️ Available Tools (45)

### 📨 Messaging

| Tool | Description | Inputs |
|------|-------------|--------|
| `send-message` | Send a text message. Messages over 4096 characters are automatically split while preserving word boundaries | `chatId`, `text` |
| `edit-message-text` | Edit the text of a message previously sent by the bot | `chatId`, `messageId`, `text` |
| `delete-message` | Delete a message from a chat | `chatId`, `messageId` |
| `forward-message` | Forward a message from one chat to another (keeps a link to the original) | `chatId`, `fromChatId`, `messageId` |
| `copy-message` | Copy a message to another chat without a link to the original | `chatId`, `fromChatId`, `messageId` |
| `send-chat-action` | Show a status indicator like "typing…" or "sending photo…" | `chatId`, `action` |

### 🖼️ Media

| Tool | Description | Inputs |
|------|-------------|--------|
| `send-photo` | Send a photo with an optional caption (long captions are split automatically) | `chatId`, `media`, `text?` |
| `send-document` | Send a document/file (PDF, ZIP, etc., up to 50 MB) | `chatId`, `media`, `caption?` |
| `send-video` | Send an MPEG4 video | `chatId`, `media`, `caption?` |
| `send-audio` | Send an audio file for the music player (.MP3/.M4A) | `chatId`, `media`, `caption?` |
| `send-voice` | Send a playable voice message (.OGG/OPUS, .MP3, .M4A) | `chatId`, `media`, `caption?` |
| `send-animation` | Send an animation (GIF or soundless MPEG4) | `chatId`, `media`, `caption?` |
| `send-sticker` | Send a static, animated, or video sticker | `chatId`, `media` |
| `get-file` | Get file info and a direct HTTPS download link for any file_id | `fileId` |

For all media tools, `media` accepts a Telegram `file_id` (recommended) or an HTTP URL.

### 🎲 Interactive Content

| Tool | Description | Inputs |
|------|-------------|--------|
| `send-poll` | Send a native poll or quiz (anonymous mode, multiple answers, quiz mode with a correct answer) | `chatId`, `question`, `options`, `isAnonymous?`, `allowsMultipleAnswers?`, `type?`, `correctOptionId?` |
| `send-dice` | Send an animated random-value emoji (🎲 🎯 🏀 ⚽ 🎳 🎰) | `chatId`, `emoji?` |
| `send-location` | Send a point on the map | `chatId`, `latitude`, `longitude` |
| `send-contact` | Send a phone contact | `chatId`, `phoneNumber`, `firstName`, `lastName?` |

### 👥 Chat & Member Management

| Tool | Description | Inputs |
|------|-------------|--------|
| `get-chat` | Fetch full chat metadata and details | `chatId` |
| `get-chat-member` | Get detailed info about a chat member | `chatId`, `userId` |
| `get-chat-member-count` | Get the total number of members in a chat | `chatId` |
| `get-chat-administrators` | List all chat administrators with their rights | `chatId` |
| `kick-chat-member` | Ban a user from a group, supergroup, or channel | `chatId`, `userId` |
| `un-ban-chat-member` | Unban a previously banned user | `chatId`, `userId` |
| `restrict-chat-member` | Mute or limit what a user can send in a supergroup | `chatId`, `userId`, permission flags, `untilDate?` |
| `promote-chat-member` | Promote a user to administrator (or demote them) | `chatId`, `userId`, admin right flags |
| `get-user-profile-photos` | Get a user's profile pictures | `userId`, `offset?`, `limit?` |
| `leave-chat` | Make the bot leave a group, supergroup, or channel | `chatId` |

### 🔧 Chat Settings

| Tool | Description | Inputs |
|------|-------------|--------|
| `set-chat-title` | Change the title of a group or channel | `chatId`, `title` |
| `set-chat-description` | Change the description of a group or channel | `chatId`, `description` |
| `pin-chat-message` | Pin a message (optionally silently) | `chatId`, `messageId`, `disableNotification?` |
| `unpin-chat-message` | Unpin a message (or the most recent pin) | `chatId`, `messageId?` |
| `unpin-all-chat-messages` | Unpin all pinned messages at once | `chatId` |

### 🔗 Invite Links

| Tool | Description | Inputs |
|------|-------------|--------|
| `create-chat-invite-link` | Create an additional invite link (with optional name, expiry, member limit) | `chatId`, `name?`, `expireDate?`, `memberLimit?` |
| `revoke-chat-invite-link` | Revoke an invite link created by the bot | `chatId`, `inviteLink` |
| `export-chat-invite-link` | Generate a new primary invite link (revokes the old one) | `chatId` |

### 🤖 Bot Configuration

| Tool | Description | Inputs |
|------|-------------|--------|
| `get-me` | Test the bot's auth token and get bot info | — |
| `set-my-name` / `get-my-name` | Configure and retrieve the bot's name | `name` (0-64 chars) |
| `set-my-description` / `get-my-description` | Configure and retrieve the bot's description (shown in empty chats) | `description` (0-512 chars) |
| `set-my-short-description` / `get-my-short-description` | Configure and retrieve the bot's short description (profile page) | `short_description` (0-120 chars) |
| `set-my-commands` / `get-my-commands` | Configure and retrieve the bot's command menu | `commands` array of `{ command, description }` |

## 🆕 New Features

### Rich Media Support
- **Documents, Video, Audio, Voice, Animations, Stickers**: Send any kind of media by `file_id` or URL
- **File Downloads**: Resolve any `file_id` to a direct HTTPS download link with `get-file`

### Interactive Content
- **Polls & Quizzes**: Native polls with anonymous mode, multiple answers, and quiz mode with a correct answer
- **Dice, Locations, Contacts**: Fun animated emoji, map points, and phone contacts
- **Chat Actions**: Show "typing…" and other status indicators while preparing a response

### Full Message Lifecycle
- **Edit & Delete**: Update or remove messages the bot has sent
- **Forward & Copy**: Move content between chats, with or without attribution
- **Pin Management**: Pin, unpin, and bulk-unpin messages

### Group Administration
- **Moderation**: Ban, unban, mute/restrict, and promote members
- **Chat Settings**: Update titles and descriptions, list administrators
- **Invite Links**: Create, revoke, and rotate invite links with expiry and member limits

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
