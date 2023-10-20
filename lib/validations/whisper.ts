import * as z from 'zod';

export const WhisperValidation = z.object({
    whisper:z.string().nonempty().min(3,'Minimum 3 characters'),
    accountId:z.string()
})

export const CommentValidation = z.object({
    whisper:z.string().nonempty().min(3,'Minimum 3 characters'),
    accountId:z.string()
})