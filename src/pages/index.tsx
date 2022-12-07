import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import { useUserContext } from '../context/user';

export default function Home() {
    let user = useUserContext();

    if (!user) {
        return <LoginForm />
    }
    return (
        <>
            <Link href="/posts">View posts</Link>
            <Link href="/posts/new">Create post</Link>
        </>
    )
}
