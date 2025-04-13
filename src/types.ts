import { z } from "zod";

export const TelegramCommandSchema = z.object({
  command: z.string().min(1, "Command is required"),
  description: z.string().min(1, "Description is required"),
});
