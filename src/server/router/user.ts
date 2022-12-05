import { z } from 'zod';
import { createUserSchema } from '../../schema/user';
import trpc from '@trpc/server';
import { baseProcedure, router } from '../trpc';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';


export const userRouter = router({
  all: baseProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }),
  register: baseProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
        try{
            const user = await ctx.prisma.user.create({
                data: input,
              });
              return user;
        } catch(e){
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === 'P2002'){
                    throw new trpc.TRPCError({
                        code: 'CONFLICT',
                        message: 'User already exists'
                    })
                }
            }

            throw new trpc.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong'
            })
        }
      
    }),
  edit: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          completed: z.boolean().optional(),
          text: z.string().min(1).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const todo = await ctx.user.update({
        where: { id },
        data,
      });
      return todo;
    }),
  delete: baseProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.user.delete({ where: { id } });
      return id;
    }),
  clearCompleted: baseProcedure.mutation(async ({ ctx }) => {
    await ctx.user.deleteMany({ where: { completed: true } });

    return ctx.user.findMany();
  }),
});