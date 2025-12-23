/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:05:00
 * Last Updated: 2025-12-23T21:05:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { organization, todo } from '@/models/Schema';
import { createTRPCRouter, protectedProcedure } from '@/server/trpc';

export const organizationRouter = createTRPCRouter({
  // Get all organizations for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      return [];
    }

    return await db
      .select()
      .from(organization)
      .where(eq(organization.userId, userId))
      .orderBy(desc(organization.createdAt));
  }),

  // Create a new organization
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const result = await db
        .insert(organization)
        .values({
          name: input.name,
          description: input.description,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    }),

  // Get todos for an organization
  getTodos: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        return [];
      }

      // First verify the organization belongs to the user
      const org = await db
        .select()
        .from(organization)
        .where(eq(organization.id, input.organizationId))
        .limit(1);

      if (!org[0] || org[0].userId !== userId) {
        return [];
      }

      return await db
        .select()
        .from(todo)
        .where(eq(todo.organizationId, input.organizationId))
        .orderBy(desc(todo.createdAt));
    }),

  // Create a todo
  createTodo: protectedProcedure
    .input(z.object({
      organizationId: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      // Verify organization ownership
      const org = await db
        .select()
        .from(organization)
        .where(eq(organization.id, input.organizationId))
        .limit(1);

      if (!org[0] || org[0].userId !== userId) {
        throw new Error('Organization not found or access denied');
      }

      const result = await db
        .insert(todo)
        .values({
          title: input.title,
          description: input.description,
          organizationId: input.organizationId,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    }),

  // Toggle todo completion
  toggleTodo: protectedProcedure
    .input(z.object({
      id: z.string(),
      completed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      // Verify todo belongs to user's organization
      const todoItem = await db
        .select({
          todo,
          organization,
        })
        .from(todo)
        .innerJoin(organization, eq(todo.organizationId, organization.id))
        .where(eq(todo.id, input.id))
        .limit(1);

      if (!todoItem[0] || todoItem[0].organization.userId !== userId) {
        throw new Error('Todo not found or access denied');
      }

      await db
        .update(todo)
        .set({
          completed: input.completed,
          updatedAt: new Date(),
        })
        .where(eq(todo.id, input.id));

      return { success: true };
    }),
});
