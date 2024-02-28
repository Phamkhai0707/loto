import * as z from "zod";

export const LotoValidation = z.object({
  loto: z.string().nonempty().min(3, { message: "Minimum3 characters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  loto: z.string().nonempty().min(3, { message: "Minimum3 characters" }),
  accountId: z.string(),
});
