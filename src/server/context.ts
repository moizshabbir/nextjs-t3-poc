import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NextApiRequest } from 'next';
import { verifyJWT } from '../utils/jwt';
import { db } from '../utils/prisma';

interface CtxUser {
  id: string
  email: string
  name: string
  iat: string
  exp: number
};

function getUserFromRequest(req: NextApiRequest){
  const token = req.cookies.token;

  if(token){
    try{
      const verfied = verifyJWT<CtxUser>(token);
      return verfied;
    } catch(e) {
      return null;
    }

  }
  return null;
}

// create context based of incoming request
// set as optional here so it can also be re-used for `getStaticProps()`
export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions,
) => {
  let user; 
  if(opts?.req)
    user = getUserFromRequest(opts?.req);
  return {
    req: opts?.req,
    res: opts?.res,
    db,
    user
  };
};
export type Context = trpc.inferAsyncReturnType<typeof createContext>;