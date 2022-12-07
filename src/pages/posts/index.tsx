import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { trpc } from "../../utils/trpc";

export default function PostListingPage(){
    const posts = trpc.post.posts.useQuery();

    if(!posts.data){
        return <p>Loading...</p>
    }
    console.log(posts.data);
    return (
        <div>
            {posts.data.map((post: { id: string; title: string; }) => {
                return (<article key={post.id}>
                    <p>{post.title}</p>
                    <Link href={`/posts/${post.id}`}>Read post</Link>
                </article>);
            })}
        </div>
    )
}