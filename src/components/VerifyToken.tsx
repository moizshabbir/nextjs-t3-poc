import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";


export default function VerifyToken({hash}:{hash: string}){
    const router = useRouter();
    const verify = trpc.user.verifyOtp.useQuery({hash});
    if(!verify.data)
        return <p>Verifying...</p>

    router.push(verify.data?.redirect.includes('login')?'/': verify.data?.redirect || '/');
    return <p>Redirecting...</p>
}