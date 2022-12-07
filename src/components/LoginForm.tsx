import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RequestOTPInput } from "../schema/user";
import { trpc } from "../utils/trpc";
import VerifyToken from "./VerifyToken";

export default function LoginForm() {
    const {handleSubmit, register} = useForm<RequestOTPInput>();
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const login = trpc.user.login.useMutation({
        onSuccess: (res) => {
            setSuccess(true);
            // router.push('/login');
        }   
    })

    function onSubmit(values: RequestOTPInput) {
        login.mutate({...values, redirect: router.asPath });
    }

    const hash = router.asPath.split('#token=')[1];

    if(hash)
        return <VerifyToken hash={hash} />;

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            {login.error && login.error.message}
            {success && <p>Check your email</p>}
            <h1>Login</h1>
            <input type="email" placeholder="test@example.com" {...register('email')} />
            <br />

            <button type="submit">Login</button>
        </form>
        <Link href="/register">Register</Link>
        </>
    )
}