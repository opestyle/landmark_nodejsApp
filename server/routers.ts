import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContact, getContacts, deleteContact, isDatabaseAvailable } from "./db";
import { systemRouter } from "./_core/systemRouter";
import { logger } from "./logger";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  /**
   * Database health check.
   * The frontend polls this endpoint to determine whether to show the
   * "Database unavailable" banner and disable write operations.
   */
  dbStatus: publicProcedure.query(async () => {
    const available = await isDatabaseAvailable();
    return { available };
  }),

  // Contact form procedures
  contacts: router({
    list: publicProcedure.query(async () => {
      logger.info("[API] contacts.list called");
      return await getContacts();
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          email: z.string().email(),
          contact: z.string().min(1).max(20),
          address: z.string().min(1),
          country: z.string().min(1).max(100),
        })
      )
      .mutation(async ({ input }) => {
        logger.info(`[API] contacts.create called for ${input.name}`);
        try {
          return await createContact(input);
        } catch (error: any) {
          if (error?.message === "DATABASE_UNAVAILABLE") {
            throw new TRPCError({
              code: "SERVICE_UNAVAILABLE",
              message:
                "The database is not available. Please ensure the database service is running.",
            });
          }
          throw error;
        }
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        logger.info(`[API] contacts.delete called for id=${input.id}`);
        try {
          return await deleteContact(input.id);
        } catch (error: any) {
          if (error?.message === "DATABASE_UNAVAILABLE") {
            throw new TRPCError({
              code: "SERVICE_UNAVAILABLE",
              message:
                "The database is not available. Please ensure the database service is running.",
            });
          }
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
