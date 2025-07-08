import { Telegraf } from "telegraf";

// Telegram's message length limit
export const TELEGRAM_MESSAGE_LIMIT = 4096;

/**
 * Interface for error details
 */
export interface TelegramError {
  code?: number;
  description: string;
  context?: string;
  originalError?: any;
}

/**
 * Splits a long message into chunks that respect Telegram's character limit
 * while preserving word boundaries and formatting where possible
 */
export function splitMessage(text: string, maxLength: number = TELEGRAM_MESSAGE_LIMIT): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  // Split by paragraphs first (double newlines)
  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    // If a single paragraph is too long, we need to split it further
    if (paragraph.length > maxLength) {
      // If we have content in current chunk, save it first
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // Split long paragraph by sentences
      const sentences = paragraph.split(/(?<=[.!?])\s+/);

      for (const sentence of sentences) {
        // If a single sentence is still too long, split by words
        if (sentence.length > maxLength) {
          // Save current chunk if it has content
          if (currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
          }

          // Split by words
          const words = sentence.split(' ');
          for (const word of words) {
            // If a single word is too long, we have to split it (rare case)
            if (word.length > maxLength) {
              // Save current chunk if it has content
              if (currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
              }

              // Split the word into character chunks
              for (let i = 0; i < word.length; i += maxLength - 3) {
                const wordChunk = word.slice(i, i + maxLength - 3);
                chunks.push(wordChunk + (i + maxLength - 3 < word.length ? '...' : ''));
              }
            } else {
              // Check if adding this word would exceed the limit
              const testChunk = currentChunk + (currentChunk ? ' ' : '') + word;
              if (testChunk.length > maxLength) {
                // Save current chunk and start new one
                chunks.push(currentChunk.trim());
                currentChunk = word;
              } else {
                currentChunk = testChunk;
              }
            }
          }
        } else {
          // Check if adding this sentence would exceed the limit
          const testChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
          if (testChunk.length > maxLength) {
            // Save current chunk and start new one
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk = testChunk;
          }
        }
      }
    } else {
      // Check if adding this paragraph would exceed the limit
      const testChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;
      if (testChunk.length > maxLength) {
        // Save current chunk and start new one
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk = testChunk;
      }
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Sends a message with automatic splitting if it exceeds the character limit
 */
export async function sendLongMessage(
  bot: Telegraf,
  chatId: string,
  text: string,
  options?: any
): Promise<void> {
  const chunks = splitMessage(text);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLastChunk = i === chunks.length - 1;

    // Add part indicator for multi-part messages
    const messageText = chunks.length > 1
      ? `${chunk}\n\n📄 Part ${i + 1}/${chunks.length}`
      : chunk;

    try {
      await bot.telegram.sendMessage(chatId, messageText, options);

      // Add a small delay between messages to avoid rate limiting
      if (!isLastChunk) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      throw createTelegramError(error, `Failed to send message part ${i + 1}/${chunks.length}`);
    }
  }
}

/**
 * Sends a photo with caption, handling long captions by splitting them
 */
export async function sendPhotoWithLongCaption(
  bot: Telegraf,
  chatId: string,
  media: string,
  caption?: string,
  options?: any
): Promise<void> {
  if (!caption || caption.length <= TELEGRAM_MESSAGE_LIMIT) {
    // Caption is short enough, send normally
    await bot.telegram.sendPhoto(chatId, media, { ...options, caption });
    return;
  }

  // Caption is too long, split it
  const chunks = splitMessage(caption);

  // Send photo with first chunk as caption
  const firstChunk = chunks[0];
  const photoCaption = chunks.length > 1
    ? `${firstChunk}\n\n📄 Part 1/${chunks.length}`
    : firstChunk;

  try {
    await bot.telegram.sendPhoto(chatId, media, { ...options, caption: photoCaption });

    // Send remaining chunks as separate messages
    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i];
      const messageText = `${chunk}\n\n📄 Part ${i + 1}/${chunks.length}`;

      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      await bot.telegram.sendMessage(chatId, messageText);
    }
  } catch (error) {
    throw createTelegramError(error, 'Failed to send photo with long caption');
  }
}

/**
 * Creates a standardized error object with detailed information
 */
export function createTelegramError(error: any, context?: string): TelegramError {
  let telegramError: TelegramError = {
    description: 'Unknown error occurred',
    context: context || 'Telegram API operation',
    originalError: error
  };

  if (error?.response?.error_code) {
    // Telegram API error
    telegramError.code = error.response.error_code;
    telegramError.description = error.response.description || error.message || 'Telegram API error';
  } else if (error?.code) {
    // Network or other coded error
    telegramError.code = error.code;
    telegramError.description = error.message || 'Network or system error';
  } else if (error?.message) {
    // Generic error with message
    telegramError.description = error.message;
  } else if (typeof error === 'string') {
    // String error
    telegramError.description = error;
  }

  return telegramError;
}

/**
 * Formats an error for MCP response
 */
export function formatErrorForMCP(error: TelegramError): string {
  let errorMessage = `Error: ${error.description}`;

  if (error.code) {
    errorMessage = `Error ${error.code}: ${error.description}`;
  }

  if (error.context) {
    errorMessage += `\nContext: ${error.context}`;
  }

  return errorMessage;
}

/**
 * Logs error details for debugging while maintaining privacy
 */
export function logError(error: TelegramError, operation: string): void {
  console.error(`[${operation}] ${error.code ? `Code ${error.code}: ` : ''}${error.description}`);

  if (error.context) {
    console.error(`[${operation}] Context: ${error.context}`);
  }

  // Log original error for debugging (but not sensitive data)
  if (error.originalError && process.env.NODE_ENV === 'development') {
    console.error(`[${operation}] Original error:`, error.originalError);
  }
}

/**
 * Generic error handler for MCP tool responses
 */
export function handleToolError(error: any, operation: string, context?: string): any {
  const telegramError = createTelegramError(error, context || operation);
  logError(telegramError, operation);

  return {
    content: [
      {
        type: "text",
        text: formatErrorForMCP(telegramError),
      },
    ],
  };
}
