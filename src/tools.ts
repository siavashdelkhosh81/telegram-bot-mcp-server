import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Telegraf } from "telegraf";
import { z } from "zod";
import { TelegramCommandSchema } from "./types";
import {
  sendLongMessage,
  sendPhotoWithLongCaption,
  createTelegramError,
  formatErrorForMCP,
  logError,
  handleToolError
} from "./utils";

/**
 * Registers all Telegram bot tools with the MCP server
 */
export function registerAllTools(server: McpServer, bot: Telegraf) {
  server.tool(
    "get-me",
    "A simple method for testing your bot's authentication token. Requires no parameters. Returns detailed bot information or comprehensive error details.",
    async () => {
      try {
        const response = await bot.telegram.getMe();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        const telegramError = createTelegramError(error, 'Testing bot authentication');
        logError(telegramError, 'get-me');

        return {
          content: [
            {
              type: "text",
              text: formatErrorForMCP(telegramError),
            },
          ],
        };
      }
    }
  );

  server.tool(
    "send-message",
    "Send message using a chat id. Automatically splits long messages that exceed Telegram's 4096 character limit while preserving word boundaries and formatting.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      text: z.string().describe("Message the user want to send to chat id. Long messages will be automatically split into multiple parts."),
    },
    async ({ chatId, text }) => {
      try {
        await sendLongMessage(bot, chatId, text);

        return {
          content: [
            {
              type: "text",
              text: "Message sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        const telegramError = createTelegramError(error, `Sending message to chat ${chatId}`);
        logError(telegramError, 'send-message');

        return {
          content: [
            {
              type: "text",
              text: formatErrorForMCP(telegramError),
            },
          ],
        };
      }
    }
  );

  server.tool(
    "send-photo",
    "Send photo with caption using a chat id. Automatically handles long captions that exceed Telegram's character limit by splitting them across multiple messages.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      text: z
        .string()
        .describe("Caption for the photo. Long captions will be automatically split into multiple messages.")
        .optional(),
      media: z
        .string()
        .describe(
          "Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20 "
        ),
    },
    async ({ chatId, text, media }) => {
      try {
        await sendPhotoWithLongCaption(bot, chatId, media, text);

        return {
          content: [
            {
              type: "text",
              text: "Photo sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        const telegramError = createTelegramError(error, `Sending photo to chat ${chatId}`);
        logError(telegramError, 'send-photo');

        return {
          content: [
            {
              type: "text",
              text: formatErrorForMCP(telegramError),
            },
          ],
        };
      }
    }
  );

  server.tool(
    "kick-chat-member",
    "Kick a user from a group, a supergroup or a channel. Provides detailed error information if the operation fails.",
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
              text: `User ${userId} banned from chat ${chatId} successfully`,
            },
          ],
        };
      } catch (error) {
        const telegramError = createTelegramError(error, `Banning user ${userId} from chat ${chatId}`);
        logError(telegramError, 'kick-chat-member');

        return {
          content: [
            {
              type: "text",
              text: formatErrorForMCP(telegramError),
            },
          ],
        };
      }
    }
  );

  server.tool(
    "un-ban-chat-member",
    "Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically. Provides detailed error information if the operation fails.",
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
              text: `User ${userId} unbanned from chat ${chatId} successfully`,
            },
          ],
        };
      } catch (error) {
        const telegramError = createTelegramError(error, `Unbanning user ${userId} from chat ${chatId}`);
        logError(telegramError, 'un-ban-chat-member');

        return {
          content: [
            {
              type: "text",
              text: formatErrorForMCP(telegramError),
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get-chat",
    "Use this method to get up-to-date information about the chat. Returns detailed chat information or comprehensive error details.",
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
              text: JSON.stringify(chatFullInfo, null, 2),
            },
          ],
        };
      } catch (error) {
        const telegramError = createTelegramError(error, `Getting chat information for ${chatId}`);
        logError(telegramError, 'get-chat');

        return {
          content: [
            {
              type: "text",
              text: formatErrorForMCP(telegramError),
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
        return handleToolError(error, 'get-chat-member-count', `Getting member count for chat ${chatId}`);
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
        return handleToolError(error, 'get-chat-member', `Getting member ${userId} info from chat ${chatId}`);
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
        return handleToolError(error, 'set-my-short-description', 'Setting bot short description');
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
        return handleToolError(error, 'get-my-short-description', 'Getting bot short description');
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
        return handleToolError(error, 'set-my-commands', 'Setting bot commands');
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
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'get-my-commands', 'Getting bot commands');
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
        return handleToolError(error, 'set-my-name', 'Setting bot name');
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
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'get-my-name', 'Getting bot name');
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
        return handleToolError(error, 'set-my-description', 'Setting bot description');
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
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'get-my-description', 'Getting bot description');
      }
    }
  );
}
