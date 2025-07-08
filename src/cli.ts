#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Telegraf } from "telegraf";
import { z } from "zod";
import { TelegramCommandSchema } from "./types";
import { BotCommand } from "telegraf/types";
import {
  sendLongMessage,
  sendPhotoWithLongCaption,
  createTelegramError,
  formatErrorForMCP,
  logError,
  handleToolError
} from "./utils";
import { registerAllTools } from "./tools";

// CLI argument parsing
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const showVersion = args.includes('--version') || args.includes('-v');

// Package information
const packageInfo = {
  name: "telegram-bot-mcp-server",
  version: "1.0.0",
  description: "A Model Context Protocol (MCP) server for Telegram Bot API integration"
};

if (showVersion) {
  console.log(`${packageInfo.name} v${packageInfo.version}`);
  process.exit(0);
}

if (showHelp) {
  console.log(`
${packageInfo.name} v${packageInfo.version}
${packageInfo.description}

USAGE:
  npx telegram-bot-mcp-server [options]
  telegram-bot-mcp-server [options]

OPTIONS:
  -h, --help     Show this help message
  -v, --version  Show version information

ENVIRONMENT VARIABLES:
  TELEGRAM_BOT_API_TOKEN  Your Telegram bot token (required)
                         Get one from @BotFather on Telegram

EXAMPLES:
  # Run with environment variable
  TELEGRAM_BOT_API_TOKEN=your_token_here npx telegram-bot-mcp-server

  # Run with token in .env file
  npx telegram-bot-mcp-server

MCP CLIENT CONFIGURATION:
Add this to your MCP client configuration:

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

FEATURES:
- Send messages with automatic splitting for long content
- Send photos with captions
- Manage chat members (ban/unban)
- Get chat and member information
- Configure bot settings (name, description, commands)
- Comprehensive error handling with detailed feedback

For more information, visit: https://github.com/siavashdelkhosh81/telegram-bot-mcp-server
`);
  process.exit(0);
}

// Check for bot token
const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;

if (!TELEGRAM_BOT_API_TOKEN) {
  console.error(`
❌ Error: Missing Telegram Bot Token

Please set the TELEGRAM_BOT_API_TOKEN environment variable.

To get a bot token:
1. Open Telegram and search for @BotFather
2. Start a conversation and run: /newbot
3. Follow the prompts to create your bot
4. Copy the token and set it as an environment variable

Examples:
  TELEGRAM_BOT_API_TOKEN=your_token_here npx telegram-bot-mcp-server

Or add it to your MCP client configuration:
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
`);
  process.exit(1);
}

// Initialize the MCP server and bot
const server = new McpServer({
  name: "telegram_bot",
  version: packageInfo.version,
  capabilities: {
    resources: {},
    tools: {},
  },
});

const bot = new Telegraf(TELEGRAM_BOT_API_TOKEN);

// Register all tools from the shared tools module
registerAllTools(server, bot);

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Telegram bot MCP Server running on stdio");
  } catch (error) {
    const telegramError = createTelegramError(error, 'Starting MCP server');
    logError(telegramError, 'main');
    console.error("Failed to start Telegram bot MCP Server:", formatErrorForMCP(telegramError));
    process.exit(1);
  }
}

main();
