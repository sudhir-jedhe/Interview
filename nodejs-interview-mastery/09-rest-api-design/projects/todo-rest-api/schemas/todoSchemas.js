// schemas/todoSchemas.js — request validation schemas, kept separate from
// route logic so they can be reused/tested independently.

const { z } = require('zod');

const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(200),
  dueDate: z.string().datetime().nullable().optional(),
});

// PUT requires the full representation of the resource
const replaceTodoSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(200),
  done: z.boolean(),
  dueDate: z.string().datetime().nullable().optional(),
});

// PATCH allows any subset of fields, but requires at least one
const patchTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    done: z.boolean().optional(),
    dueDate: z.string().datetime().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

module.exports = { createTodoSchema, replaceTodoSchema, patchTodoSchema };
