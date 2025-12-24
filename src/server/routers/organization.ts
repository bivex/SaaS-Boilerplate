/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:05:00
 * Last Updated: 2025-12-23T22:27:06
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { organizationSchema, todoSchema } from '@/models/Schema';
import { createTRPCRouter, protectedProcedure } from '@/server/trpc';

export const organizationRouter = createTRPCRouter({
  // Get all organizations for the current user
  getAll: protectedProcedure.query(async () => {
    // Note: Current schema doesn't have userId field on organization
    // This would need to be updated based on your business logic
    return await db
      .select()
      .from(organizationSchema)
      .orderBy(desc(organizationSchema.createdAt));
  }),

  // Create a new organization
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ _input }) => {
      const result = await db
        .insert(organizationSchema)
        .values({
          // Note: Current schema doesn't have name/description fields
          // This would need to be updated based on your business logic
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning();

      return result[0];
    }),

  // Get todos for the current user
  getTodos: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        return [];
      }

      return await db
        .select()
        .from(todoSchema)
        .where(eq(todoSchema.ownerId, userId))
        .orderBy(desc(todoSchema.createdAt));
    }),

  // Create a todo
  createTodo: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      message: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const result = await db
        .insert(todoSchema)
        .values({
          title: input.title,
          message: input.message || '',
          ownerId: userId,
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning();

      return result[0];
    }),

  // Toggle todo completion
  toggleTodo: protectedProcedure
    .input(z.object({
      id: z.number(),
      completed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      // Verify todo belongs to user
      const todoItem = await db
        .select()
        .from(todoSchema)
        .where(eq(todoSchema.id, input.id))
        .limit(1);

      if (!todoItem[0] || todoItem[0].ownerId !== userId) {
        throw new Error('Todo not found or access denied');
      }

      await db
        .update(todoSchema)
        .set({
          // Note: Current schema doesn't have completed field
          // This would need to be added to the schema
          updatedAt: new Date(),
        })
        .where(eq(todoSchema.id, input.id));

      return { success: true };
    }),
});
