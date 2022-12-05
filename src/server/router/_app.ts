import { baseProcedure, router } from '../trpc';

// export const appRouter = router({
//   todo: todoRouter,
// });

export const appRouter = router({
    hello: baseProcedure.query(({ctx}) => {
        return 'Hello from trpc server'
    })
});

export type AppRouter = typeof appRouter;