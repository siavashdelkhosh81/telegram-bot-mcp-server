import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Telegraf } from "telegraf";
import { createTelegramError, formatErrorForMCP, logError } from "./utils";
import { registerAllTools } from "./tools";

const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;

if (!TELEGRAM_BOT_API_TOKEN) {
  console.error("No bot token");
  process.exit(1);
}

const server = new McpServer({
  name: "telegram_bot",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const bot = new Telegraf(TELEGRAM_BOT_API_TOKEN);

// Register all tools using the shared tools module
registerAllTools(server, bot);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Telegram bot MCP Server running on stdio");
}

main().catch((error) => {
  const telegramError = createTelegramError(error, 'Starting MCP server');
  logError(telegramError, 'main');
  console.error("Failed to start Telegram bot MCP Server:", formatErrorForMCP(telegramError));
  process.exit(1);
});
