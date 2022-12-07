import { TRPCError } from '@trpc/server';
import { baseProcedure, router } from '../trpc';
import { createPostSchema, getSinglePostSchema } from '../../schema/post';


export const postRouter = router({
    posts: baseProcedure.query(({ ctx }) => {
        return ctx.db.post.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });
    }),
    createPost: baseProcedure
        .input(createPostSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                if (!ctx.user) {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'You are not allowed'
                    });
                }
                console.log(input);
                const record = await ctx.db.post.create({
                    data: { title: input.title, 
                        body: input.body,
                        user:{connect:{id: ctx.user.id}}
                    },
                });
                return record;
            } catch (e) {
                console.log(e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),
    singlePost: baseProcedure
        .input(getSinglePostSchema)
        .query(({ ctx, input }) => {
            try {
                const record = ctx.db.post.findFirst({
                    where: { id: input.postId },
                    include: {
                        user: true
                    }
                });
                return record;
            } catch (e) {
                console.log("data error", e);

                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),
});