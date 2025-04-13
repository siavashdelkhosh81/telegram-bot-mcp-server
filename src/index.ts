import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Telegraf } from "telegraf";
import { z } from "zod";
import { TelegramCommandSchema } from "./types";
import { BotCommand } from "telegraf/types";

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

server.tool(
  "get-me",
  "A simple method for testing your bot's authentication token. Requires no parameters",
  async () => {
    try {
      const response = await bot.telegram.getMe();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "send-message",
  "Send message using a chat id",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
    text: z.string().describe("Message the user want to send to chat id"),
  },
  async ({ chatId, text }) => {
    try {
      await bot.telegram.sendMessage(chatId, text);

      return {
        content: [
          {
            type: "text",
            text: "Message sent to telegram user chat id",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "send-photo",
  "Send photo with message using a chat id",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
    text: z
      .string()
      .describe("Caption for the photo that user want to send")
      .optional(),
    media: z
      .string()
      .describe(
        "Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20 "
      ),
  },
  async ({ chatId, text, media }) => {
    try {
      await bot.telegram.sendPhoto(chatId, media, { caption: text });

      return {
        content: [
          {
            type: "text",
            text: "Message sent to telegram user chat id",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "kick-chat-member",
  "Kick a user from a group, a supergroup or a channel",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
    userId: z.number().describe("Unique identifier of the target user"),
  },
  async ({ chatId, userId }) => {
    try {
      await bot.telegram.banChatMember(chatId, userId);

      return {
        content: [
          {
            type: "text",
            text: "user banned from chat successfully",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "un-ban-chat-member",
  "Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
    userId: z.number().describe("Unique identifier of the target user"),
  },
  async ({ chatId, userId }) => {
    try {
      await bot.telegram.unbanChatMember(chatId, userId, {
        only_if_banned: true,
      });

      return {
        content: [
          {
            type: "text",
            text: "user unbanned from chat successfully",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-chat",
  "Use this method to get up-to-date information about the chat",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
  },
  async ({ chatId }) => {
    try {
      const chatFullInfo = await bot.telegram.getChat(chatId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(chatFullInfo),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-chat-member-count",
  "Use this method to get the number of members in a chat",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
  },
  async ({ chatId }) => {
    try {
      const memberCount = await bot.telegram.getChatMembersCount(chatId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(memberCount),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-chat-member",
  "get information about a member of a chat",
  {
    chatId: z
      .string()
      .describe(
        "Unique identifier for the target chat or username of the target channel"
      ),
    userId: z.number().describe("Unique identifier of the target user"),
  },
  async ({ chatId, userId }) => {
    try {
      const member = await bot.telegram.getChatMember(chatId, userId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(member),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "set-my-short-description",
  "Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot",
  {
    short_description: z
      .string()
      .describe(
        "New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language"
      ),
  },
  async ({ short_description }) => {
    try {
      await bot.telegram.setMyShortDescription(short_description);

      return {
        content: [
          {
            type: "text",
            text: "Successfully update short description",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-my-short-description",
  "Use this method to get the current bot short description",
  async () => {
    try {
      const response = await bot.telegram.getMyShortDescription();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "set-my-commands",
  "Use this method to change the list of the bot's commands",
  {
    commands: z.array(TelegramCommandSchema),
  },
  async ({ commands }) => {
    try {
      await bot.telegram.setMyCommands(commands);

      return {
        content: [
          {
            type: "text",
            text: "Successfully updated bot commands",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-my-commands",
  "Use this method to get the current list of the bot's commands",
  async () => {
    try {
      const response = await bot.telegram.getMyCommands();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "set-my-name",
  "Use this method to change the bot's name",
  {
    name: z.string().describe("New bot name; 0-64 characters"),
  },
  async ({ name }) => {
    try {
      await bot.telegram.setMyName(name);

      return {
        content: [
          {
            type: "text",
            text: "Successfully updated bot name",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-my-name",
  "Use this method to get the bot's name",
  async () => {
    try {
      const response = await bot.telegram.getMyName();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "set-my-description",
  "Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty",
  {
    description: z.string().describe("New bot description; 0-512 characters"),
  },
  async ({ description }) => {
    try {
      await bot.telegram.setMyDescription(description);

      return {
        content: [
          {
            type: "text",
            text: "Successfully updated bot description",
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-my-description",
  "Use this method to get the bot's description",
  async () => {
    try {
      const response = await bot.telegram.getMyDescription();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Something went wrong`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Telegram bot MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Something went wrong", error);
  process.exit(1);
});
