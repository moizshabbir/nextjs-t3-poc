import { z } from 'zod';
import { createUserSchema, requestOTPSchema, verifyOTPSchema } from '../../schema/user';
import { TRPCError } from '@trpc/server';
import { baseProcedure, router } from '../trpc';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { sendLoginEmail } from '../../utils/mailer';
import { baseUrl } from '../../constants';
import { decode, encode } from '../../utils/base64';
import { signJWT } from '../../utils/jwt';
import { serialize } from 'cookie';
import { redirect } from 'next/dist/server/api-utils';


export const userRouter = router({
  all: baseProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }),
  me: baseProcedure.query(({ctx}) => {
    return ctx.user;
  }),
  register: baseProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
        try{
            const user = await ctx.db.user.create({
                data: input,
              });
              return user;
        } catch(e){
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === 'P2002'){
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'User already exists'
                    })
                }
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong'
            })
        }
    }),
    login: baseProcedure
    .input(requestOTPSchema)
    .mutation(async ({ ctx, input }) => {
        try{
            const users = await ctx.db.user.findMany({
              where: {email: input.email}
            });
            console.log('user found: ',users);
            if(!users.length){
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
              });
            }
            let user = users[0];
            const token = await ctx.db.loginToken.create({
                data: {redirect: input.redirect, user: {connect: {id: user.id}}},
              });
              console.log("Save Login", token);
              await sendLoginEmail(input.email, baseUrl, encode(`${token.id}:${user.email}`));
              return token;
        } catch(e){
            console.log("data error", e);
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === 'P2002'){
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'User already exists'
                    })
                }
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong'
            })
        }
    }), 
    verifyOtp: baseProcedure
    .input(verifyOTPSchema)
    .query(async ({ ctx, input }) => {
        try{
            const [id, email] = decode(input.hash).split(':');

            const record = await ctx.db.loginToken.findFirst({
              where: {id: id, user: {email: email}},
              include: {
                user: true
              }
            });
            console.log('token found: ',record);
            if(!record){
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Invalid Token'
              });
            }
            const jwt = signJWT({
                email: record.user.email,
                id: record.user.id
            });

            ctx.res?.setHeader('Set-Cookie', serialize('token', jwt , {path:'/'}))

              return {redirect: record.redirect};
        } catch(e){
            console.log("data error", e);
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code === 'P2002'){
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'User already exists'
                    })
                }
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong'
            })
        }
    }), 
});