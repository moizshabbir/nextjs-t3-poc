import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user";
import { trpc } from "../utils/trpc";

export default function RegisterPage() {
    const {handleSubmit, register} = useForm<CreateUserInput>();
    const router = useRouter();

    const registerUser = trpc.user.register.useMutation({
        onSuccess: (res) => {
            router.push('/login');
        }   
    })

    function onSubmit(values: CreateUserInput) {
        registerUser.mutate(values);
    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            {registerUser.error && registerUser.error.message}
            <h1>Register</h1>
            <input type="email" placeholder="test@example.com" {...register('email')} />
            <br />
            <input type="name" placeholder="Joe" {...register('name')} />

            <button type="submit">Register</button>
        </form>
        <Link href="/login">Login</Link>
        </>
    )
}