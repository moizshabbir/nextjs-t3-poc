import { useRouter } from "next/router";
import {useForm} from "react-hook-form";
import { CreatePostInput } from "../../schema/post";
import { trpc } from "../../utils/trpc";


export default function CreatePostPage() {
    const {handleSubmit, register} = useForm<CreatePostInput>();
    const router = useRouter();

    const post = trpc.post.createPost.useMutation({
        onSuccess(data, variables, context) {
            router.push(`/posts/${data.id}`)
        }
    });

    function onSubmit(values: CreatePostInput){
        post.mutate(values);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {post.error && post.error.message}
                <h1>Create post</h1>
                <p>
                <input className="form-control" type="text" placeholder="Your post title" {...register('title')} />
                </p>
                <p >
                <textarea {...register('body')}></textarea>
                </p>
                
                <button>Create Post</button>
            </form>
        </>
    )
}