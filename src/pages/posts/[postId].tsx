import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";


export default function SinglePostPage() {
    const router = useRouter();
    const postId = router.query.postId as string;
    console.log(`POST ID : ${postId}`);
    // const post = {data:null};
    const post = trpc.post.singlePost.useQuery({postId});

    if(!post.data)
        return <p>No post found</p>

    return (
        <>
            <h1>{post.data?.title}</h1>
            <p>
                {post.data?.body}
            </p>
        </>
    )
}