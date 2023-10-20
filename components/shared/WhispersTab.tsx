import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    currentUserId: string,
    accountId: string,
    accountType: string
}

export default async function WhispersTab({ currentUserId, accountId, accountType }: Props) {
    let result = await fetchUserPosts(accountId);

    if (!result) {
        redirect('/')
    }
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.whispers.map((whisper: any) => (
                <ThreadCard
                    key={whisper._id}
                    id={whisper._id}
                    currentUserId={currentUserId}
                    parentId={whisper.parentId}
                    content={whisper.text}
                    author={
                        accountType==='User'
                        ? {name:result.name,image:result.image,id:result.id}
                        : {name:whisper.author.name,image:whisper.author.image,
                        id:whisper.author.id}
                    }
                    
                    community={whisper.community} //todo
                    createdAt={whisper.createdAt}
                    comments={whisper.children}
                />
            ))}
        </section>
    )
}