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

  // ---------------------------------------------------------------------------
  // Media tools
  // ---------------------------------------------------------------------------

  server.tool(
    "send-document",
    "Send a document/file (PDF, ZIP, text file, etc.) to a chat. Bots can send files of up to 50 MB in size.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      media: z
        .string()
        .describe(
          "Document to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a file from the Internet"
        ),
      caption: z
        .string()
        .describe("Caption for the document; 0-1024 characters")
        .optional(),
    },
    async ({ chatId, media, caption }) => {
      try {
        await bot.telegram.sendDocument(chatId, media, { caption });

        return {
          content: [
            {
              type: "text",
              text: "Document sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-document', `Sending document to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-video",
    "Send a video to a chat. Telegram clients support MPEG4 videos (other formats may be sent as Document). Bots can send video files of up to 50 MB in size.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      media: z
        .string()
        .describe(
          "Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a video from the Internet"
        ),
      caption: z
        .string()
        .describe("Caption for the video; 0-1024 characters")
        .optional(),
    },
    async ({ chatId, media, caption }) => {
      try {
        await bot.telegram.sendVideo(chatId, media, { caption });

        return {
          content: [
            {
              type: "text",
              text: "Video sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-video', `Sending video to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-audio",
    "Send an audio file to be displayed in the music player. Audio must be in .MP3 or .M4A format. Bots can send audio files of up to 50 MB in size.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      media: z
        .string()
        .describe(
          "Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get an audio file from the Internet"
        ),
      caption: z
        .string()
        .describe("Caption for the audio; 0-1024 characters")
        .optional(),
    },
    async ({ chatId, media, caption }) => {
      try {
        await bot.telegram.sendAudio(chatId, media, { caption });

        return {
          content: [
            {
              type: "text",
              text: "Audio sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-audio', `Sending audio to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-voice",
    "Send an audio file as a playable voice message. The file must be in .OGG format encoded with OPUS, or in .MP3/.M4A format.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      media: z
        .string()
        .describe(
          "Voice message to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a file from the Internet"
        ),
      caption: z
        .string()
        .describe("Caption for the voice message; 0-1024 characters")
        .optional(),
    },
    async ({ chatId, media, caption }) => {
      try {
        await bot.telegram.sendVoice(chatId, media, { caption });

        return {
          content: [
            {
              type: "text",
              text: "Voice message sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-voice', `Sending voice message to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-animation",
    "Send an animation (GIF or H.264/MPEG-4 AVC video without sound) to a chat. Bots can send animation files of up to 50 MB in size.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      media: z
        .string()
        .describe(
          "Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get an animation from the Internet"
        ),
      caption: z
        .string()
        .describe("Caption for the animation; 0-1024 characters")
        .optional(),
    },
    async ({ chatId, media, caption }) => {
      try {
        await bot.telegram.sendAnimation(chatId, media, { caption });

        return {
          content: [
            {
              type: "text",
              text: "Animation sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-animation', `Sending animation to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-sticker",
    "Send a static .WEBP, animated .TGS, or video .WEBM sticker to a chat.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      media: z
        .string()
        .describe(
          "Sticker to send. Pass a file_id as String to send a sticker that exists on the Telegram servers (recommended), or pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet"
        ),
    },
    async ({ chatId, media }) => {
      try {
        await bot.telegram.sendSticker(chatId, media);

        return {
          content: [
            {
              type: "text",
              text: "Sticker sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-sticker', `Sending sticker to chat ${chatId}`);
      }
    }
  );

  // ---------------------------------------------------------------------------
  // Interactive content tools
  // ---------------------------------------------------------------------------

  server.tool(
    "send-poll",
    "Send a native poll or quiz to a chat. Supports anonymous polls, multiple answers, and quiz mode with a correct answer.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      question: z.string().describe("Poll question, 1-300 characters"),
      options: z
        .array(z.string())
        .min(2)
        .max(10)
        .describe("List of 2-10 answer options, each 1-100 characters"),
      isAnonymous: z
        .boolean()
        .describe("True if the poll needs to be anonymous. Defaults to true")
        .optional(),
      allowsMultipleAnswers: z
        .boolean()
        .describe(
          "True if the poll allows multiple answers. Ignored for quiz polls. Defaults to false"
        )
        .optional(),
      type: z
        .enum(["regular", "quiz"])
        .describe("Poll type: 'regular' or 'quiz'. Defaults to 'regular'")
        .optional(),
      correctOptionId: z
        .number()
        .describe(
          "0-based identifier of the correct answer option. Required for polls in quiz mode"
        )
        .optional(),
    },
    async ({ chatId, question, options, isAnonymous, allowsMultipleAnswers, type, correctOptionId }) => {
      try {
        if (type === "quiz") {
          await bot.telegram.sendQuiz(chatId, question, options, {
            is_anonymous: isAnonymous,
            correct_option_id: correctOptionId,
          });
        } else {
          await bot.telegram.sendPoll(chatId, question, options, {
            is_anonymous: isAnonymous,
            allows_multiple_answers: allowsMultipleAnswers,
            correct_option_id: correctOptionId,
          });
        }

        return {
          content: [
            {
              type: "text",
              text: "Poll sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-poll', `Sending poll to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-dice",
    "Send an animated emoji that displays a random value (dice, darts, basketball, football, bowling, or slot machine).",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      emoji: z
        .enum(["🎲", "🎯", "🏀", "⚽", "🎳", "🎰"])
        .describe(
          "Emoji on which the dice throw animation is based. Defaults to 🎲"
        )
        .optional(),
    },
    async ({ chatId, emoji }) => {
      try {
        const response = await bot.telegram.sendDice(chatId, { emoji });

        return {
          content: [
            {
              type: "text",
              text: `Dice sent successfully. Value: ${response.dice.value}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-dice', `Sending dice to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-location",
    "Send a point on the map (latitude/longitude) to a chat.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      latitude: z.number().describe("Latitude of the location"),
      longitude: z.number().describe("Longitude of the location"),
    },
    async ({ chatId, latitude, longitude }) => {
      try {
        await bot.telegram.sendLocation(chatId, latitude, longitude);

        return {
          content: [
            {
              type: "text",
              text: "Location sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-location', `Sending location to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-contact",
    "Send a phone contact to a chat.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      phoneNumber: z.string().describe("Contact's phone number"),
      firstName: z.string().describe("Contact's first name"),
      lastName: z.string().describe("Contact's last name").optional(),
    },
    async ({ chatId, phoneNumber, firstName, lastName }) => {
      try {
        await bot.telegram.sendContact(chatId, phoneNumber, firstName, {
          last_name: lastName,
        });

        return {
          content: [
            {
              type: "text",
              text: "Contact sent successfully to telegram chat",
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-contact', `Sending contact to chat ${chatId}`);
      }
    }
  );

  server.tool(
    "send-chat-action",
    "Show a status indicator in the chat (e.g. 'typing…', 'sending photo…'). The status is shown for 5 seconds or until the next message arrives. Useful to signal that a longer operation is in progress.",
    {
      chatId: z
        .string()
        .describe(
          "Unique identifier for the target chat or username of the target channel"
        ),
      action: z
        .enum([
          "typing",
          "upload_photo",
          "record_video",
          "upload_video",
          "record_voice",
          "upload_voice",
          "upload_document",
          "choose_sticker",
          "find_location",
          "record_video_note",
          "upload_video_note",
        ])
        .describe("Type of action to broadcast, matching what the user is about to receive"),
    },
    async ({ chatId, action }) => {
      try {
        await bot.telegram.sendChatAction(chatId, action);

        return {
          content: [
            {
              type: "text",
              text: `Chat action '${action}' sent successfully`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'send-chat-action', `Sending chat action to chat ${chatId}`);
      }
    }
  );

  // ---------------------------------------------------------------------------
  // Message management tools
  // ---------------------------------------------------------------------------

  server.tool(
    "forward-message",
    "Forward a message of any kind from one chat to another. The forwarded message keeps a link to the original sender.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      fromChatId: z
        .string()
        .describe("Unique identifier for the chat where the original message was sent"),
      messageId: z.number().describe("Message identifier in the chat specified in fromChatId"),
    },
    async ({ chatId, fromChatId, messageId }) => {
      try {
        await bot.telegram.forwardMessage(chatId, fromChatId, messageId);

        return {
          content: [
            {
              type: "text",
              text: `Message ${messageId} forwarded successfully from ${fromChatId} to ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'forward-message', `Forwarding message ${messageId} from ${fromChatId} to ${chatId}`);
      }
    }
  );

  server.tool(
    "copy-message",
    "Copy a message of any kind from one chat to another. Unlike forwarding, the copied message does not have a link to the original message.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      fromChatId: z
        .string()
        .describe("Unique identifier for the chat where the original message was sent"),
      messageId: z.number().describe("Message identifier in the chat specified in fromChatId"),
    },
    async ({ chatId, fromChatId, messageId }) => {
      try {
        const response = await bot.telegram.copyMessage(chatId, fromChatId, messageId);

        return {
          content: [
            {
              type: "text",
              text: `Message copied successfully. New message id: ${response.message_id}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'copy-message', `Copying message ${messageId} from ${fromChatId} to ${chatId}`);
      }
    }
  );

  server.tool(
    "edit-message-text",
    "Edit the text of a message previously sent by the bot.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      messageId: z.number().describe("Identifier of the message to edit"),
      text: z.string().describe("New text of the message, 1-4096 characters"),
    },
    async ({ chatId, messageId, text }) => {
      try {
        await bot.telegram.editMessageText(chatId, messageId, undefined, text);

        return {
          content: [
            {
              type: "text",
              text: `Message ${messageId} edited successfully`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'edit-message-text', `Editing message ${messageId} in chat ${chatId}`);
      }
    }
  );

  server.tool(
    "delete-message",
    "Delete a message from a chat. Bots can delete their own messages, and incoming messages in groups/supergroups where they have the appropriate admin rights. A message can only be deleted if it was sent less than 48 hours ago.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      messageId: z.number().describe("Identifier of the message to delete"),
    },
    async ({ chatId, messageId }) => {
      try {
        await bot.telegram.deleteMessage(chatId, messageId);

        return {
          content: [
            {
              type: "text",
              text: `Message ${messageId} deleted successfully from chat ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'delete-message', `Deleting message ${messageId} from chat ${chatId}`);
      }
    }
  );

  server.tool(
    "pin-chat-message",
    "Pin a message in a chat. The bot must be an administrator with the 'can_pin_messages' right in groups and channels.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      messageId: z.number().describe("Identifier of the message to pin"),
      disableNotification: z
        .boolean()
        .describe("True to pin silently, without sending a notification to all chat members")
        .optional(),
    },
    async ({ chatId, messageId, disableNotification }) => {
      try {
        await bot.telegram.pinChatMessage(chatId, messageId, {
          disable_notification: disableNotification,
        });

        return {
          content: [
            {
              type: "text",
              text: `Message ${messageId} pinned successfully in chat ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'pin-chat-message', `Pinning message ${messageId} in chat ${chatId}`);
      }
    }
  );

  server.tool(
    "unpin-chat-message",
    "Unpin a message in a chat. If no messageId is provided, the most recent pinned message is unpinned.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      messageId: z
        .number()
        .describe("Identifier of the message to unpin. If omitted, the most recent pinned message is unpinned")
        .optional(),
    },
    async ({ chatId, messageId }) => {
      try {
        await bot.telegram.unpinChatMessage(chatId, messageId);

        return {
          content: [
            {
              type: "text",
              text: `Message unpinned successfully in chat ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'unpin-chat-message', `Unpinning message in chat ${chatId}`);
      }
    }
  );

  server.tool(
    "unpin-all-chat-messages",
    "Unpin all pinned messages in a chat at once.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
    },
    async ({ chatId }) => {
      try {
        await bot.telegram.unpinAllChatMessages(chatId);

        return {
          content: [
            {
              type: "text",
              text: `All messages unpinned successfully in chat ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'unpin-all-chat-messages', `Unpinning all messages in chat ${chatId}`);
      }
    }
  );

  // ---------------------------------------------------------------------------
  // Chat administration tools
  // ---------------------------------------------------------------------------

  server.tool(
    "set-chat-title",
    "Change the title of a group, supergroup, or channel. The bot must be an administrator with the appropriate rights.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      title: z.string().describe("New chat title, 1-128 characters"),
    },
    async ({ chatId, title }) => {
      try {
        await bot.telegram.setChatTitle(chatId, title);

        return {
          content: [
            {
              type: "text",
              text: `Chat title updated successfully for ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'set-chat-title', `Setting title for chat ${chatId}`);
      }
    }
  );

  server.tool(
    "set-chat-description",
    "Change the description of a group, supergroup, or channel. The bot must be an administrator with the appropriate rights.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      description: z
        .string()
        .describe("New chat description, 0-255 characters. Pass an empty string to remove the description"),
    },
    async ({ chatId, description }) => {
      try {
        await bot.telegram.setChatDescription(chatId, description);

        return {
          content: [
            {
              type: "text",
              text: `Chat description updated successfully for ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'set-chat-description', `Setting description for chat ${chatId}`);
      }
    }
  );

  server.tool(
    "get-chat-administrators",
    "Get a list of administrators in a chat (all admins except other bots), including their custom titles and rights.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
    },
    async ({ chatId }) => {
      try {
        const admins = await bot.telegram.getChatAdministrators(chatId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(admins, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'get-chat-administrators', `Getting administrators of chat ${chatId}`);
      }
    }
  );

  server.tool(
    "restrict-chat-member",
    "Restrict a user in a supergroup (mute or limit what they can send). The bot must be an administrator with the appropriate rights. Pass all permissions as true to lift restrictions.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target supergroup"),
      userId: z.number().describe("Unique identifier of the target user"),
      canSendMessages: z
        .boolean()
        .describe("True if the user is allowed to send text messages, contacts, locations and venues")
        .optional(),
      canSendMedia: z
        .boolean()
        .describe("True if the user is allowed to send photos, videos, audios and documents")
        .optional(),
      canSendPolls: z
        .boolean()
        .describe("True if the user is allowed to send polls")
        .optional(),
      canSendOtherMessages: z
        .boolean()
        .describe("True if the user is allowed to send animations, games, stickers and use inline bots")
        .optional(),
      untilDate: z
        .number()
        .describe(
          "Date when restrictions will be lifted, as a unix timestamp. If the user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered restricted forever"
        )
        .optional(),
    },
    async ({ chatId, userId, canSendMessages, canSendMedia, canSendPolls, canSendOtherMessages, untilDate }) => {
      try {
        await bot.telegram.restrictChatMember(chatId, userId, {
          permissions: {
            can_send_messages: canSendMessages ?? false,
            can_send_photos: canSendMedia ?? false,
            can_send_videos: canSendMedia ?? false,
            can_send_audios: canSendMedia ?? false,
            can_send_documents: canSendMedia ?? false,
            can_send_voice_notes: canSendMedia ?? false,
            can_send_video_notes: canSendMedia ?? false,
            can_send_polls: canSendPolls ?? false,
            can_send_other_messages: canSendOtherMessages ?? false,
            can_add_web_page_previews: canSendMessages ?? false,
          },
          until_date: untilDate,
        });

        return {
          content: [
            {
              type: "text",
              text: `User ${userId} restricted successfully in chat ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'restrict-chat-member', `Restricting user ${userId} in chat ${chatId}`);
      }
    }
  );

  server.tool(
    "promote-chat-member",
    "Promote a user to administrator in a supergroup or channel, or demote them by passing all rights as false. The bot must be an administrator with the appropriate rights.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      userId: z.number().describe("Unique identifier of the target user"),
      canManageChat: z
        .boolean()
        .describe("True if the administrator can access the chat event log, boost list, and see hidden members")
        .optional(),
      canDeleteMessages: z
        .boolean()
        .describe("True if the administrator can delete messages of other users")
        .optional(),
      canRestrictMembers: z
        .boolean()
        .describe("True if the administrator can restrict, ban or unban chat members")
        .optional(),
      canPromoteMembers: z
        .boolean()
        .describe("True if the administrator can add new administrators")
        .optional(),
      canChangeInfo: z
        .boolean()
        .describe("True if the administrator can change chat title, photo and other settings")
        .optional(),
      canInviteUsers: z
        .boolean()
        .describe("True if the administrator can invite new users to the chat")
        .optional(),
      canPinMessages: z
        .boolean()
        .describe("True if the administrator can pin messages (supergroups only)")
        .optional(),
    },
    async ({ chatId, userId, canManageChat, canDeleteMessages, canRestrictMembers, canPromoteMembers, canChangeInfo, canInviteUsers, canPinMessages }) => {
      try {
        await bot.telegram.promoteChatMember(chatId, userId, {
          can_manage_chat: canManageChat,
          can_delete_messages: canDeleteMessages,
          can_restrict_members: canRestrictMembers,
          can_promote_members: canPromoteMembers,
          can_change_info: canChangeInfo,
          can_invite_users: canInviteUsers,
          can_pin_messages: canPinMessages,
        });

        return {
          content: [
            {
              type: "text",
              text: `User ${userId} promoted successfully in chat ${chatId}`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'promote-chat-member', `Promoting user ${userId} in chat ${chatId}`);
      }
    }
  );

  server.tool(
    "create-chat-invite-link",
    "Create an additional invite link for a chat. The bot must be an administrator with the appropriate rights. Returns the new invite link.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      name: z.string().describe("Invite link name; 0-32 characters").optional(),
      expireDate: z
        .number()
        .describe("Unix timestamp when the link will expire")
        .optional(),
      memberLimit: z
        .number()
        .describe(
          "Maximum number of users that can be members of the chat simultaneously after joining via this invite link; 1-99999"
        )
        .optional(),
    },
    async ({ chatId, name, expireDate, memberLimit }) => {
      try {
        const link = await bot.telegram.createChatInviteLink(chatId, {
          name,
          expire_date: expireDate,
          member_limit: memberLimit,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(link, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'create-chat-invite-link', `Creating invite link for chat ${chatId}`);
      }
    }
  );

  server.tool(
    "revoke-chat-invite-link",
    "Revoke an invite link created by the bot. If the primary link is revoked, a new one is automatically generated.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
      inviteLink: z.string().describe("The invite link to revoke"),
    },
    async ({ chatId, inviteLink }) => {
      try {
        const link = await bot.telegram.revokeChatInviteLink(chatId, inviteLink);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(link, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'revoke-chat-invite-link', `Revoking invite link for chat ${chatId}`);
      }
    }
  );

  server.tool(
    "export-chat-invite-link",
    "Generate a new primary invite link for a chat; any previously generated primary link is revoked. Returns the new invite link.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
    },
    async ({ chatId }) => {
      try {
        const link = await bot.telegram.exportChatInviteLink(chatId);

        return {
          content: [
            {
              type: "text",
              text: link,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'export-chat-invite-link', `Exporting invite link for chat ${chatId}`);
      }
    }
  );

  server.tool(
    "leave-chat",
    "Make the bot leave a group, supergroup, or channel.",
    {
      chatId: z
        .string()
        .describe("Unique identifier for the target chat or username of the target channel"),
    },
    async ({ chatId }) => {
      try {
        await bot.telegram.leaveChat(chatId);

        return {
          content: [
            {
              type: "text",
              text: `Bot left chat ${chatId} successfully`,
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'leave-chat', `Leaving chat ${chatId}`);
      }
    }
  );

  // ---------------------------------------------------------------------------
  // User and file tools
  // ---------------------------------------------------------------------------

  server.tool(
    "get-user-profile-photos",
    "Get a user's profile pictures, including file IDs that can be re-sent with send-photo.",
    {
      userId: z.number().describe("Unique identifier of the target user"),
      offset: z
        .number()
        .describe("Sequential number of the first photo to be returned. By default, all photos are returned")
        .optional(),
      limit: z
        .number()
        .describe("Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100")
        .optional(),
    },
    async ({ userId, offset, limit }) => {
      try {
        const photos = await bot.telegram.getUserProfilePhotos(userId, offset, limit);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(photos, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'get-user-profile-photos', `Getting profile photos of user ${userId}`);
      }
    }
  );

  server.tool(
    "get-file",
    "Get basic info about a file (by file_id) and a direct HTTPS download link for it. Bots can download files of up to 20 MB in size. The link is valid for at least 1 hour.",
    {
      fileId: z.string().describe("File identifier to get information about"),
    },
    async ({ fileId }) => {
      try {
        const file = await bot.telegram.getFile(fileId);
        const link = await bot.telegram.getFileLink(fileId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ...file, download_link: link.toString() }, null, 2),
            },
          ],
        };
      } catch (error) {
        return handleToolError(error, 'get-file', `Getting file info for ${fileId}`);
      }
    }
  );
}
