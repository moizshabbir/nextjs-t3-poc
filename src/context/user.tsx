import type { AppRouter } from "../server/router/_app";
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import React, { createContext, useContext } from "react";
import { TRPCContext } from "@trpc/react/dist/declarations/src/internals/context";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type TVerifyInput = RouterInput['user']['me'];
type TVerifyOutput = RouterOutput['user']['me'];

const UserContext = createContext<TVerifyOutput>(null);

function UserContextProvider({children, value}: {children: React.ReactNode, value: TVerifyOutput | undefined}) {
    return <UserContext.Provider value={value || null}>{children}</UserContext.Provider>
}

const useUserContext = () => useContext(UserContext);

export {useUserContext, UserContextProvider}