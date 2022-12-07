import dynamic from "next/dynamic";
import Link from "next/link";

const LoginForm = dynamic(() => import('../components/LoginForm'), {
    ssr: false
});

export default function LoginPage() {   
    return (
        <div>
            <LoginForm />
        </div>
    )
}