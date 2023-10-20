import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchWhisperById } from "@/lib/actions/whisper.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ({ params }: { params: { id: string } }) {
    if (!params.id) return null;
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding')

    const whisper = await fetchWhisperById(params.id);


    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={whisper._id}
                    id={whisper._id}
                    currentUserId={user?.id}
                    parentId={whisper.parentId}
                    content={whisper.text}
                    author={whisper.author}
                    community={whisper.community}
                    createdAt={whisper.createdAt}
                    comments={whisper.children}
                />
            </div>

            <div className="mt-7">
                <Comment
                    whisperId={whisper.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)} 
                />
            </div>

            <div className="mt-10">
                {whisper.children.map((childItem:any)=>(
                    <ThreadCard
                    key={childItem._id}
                    id={childItem._id}
                    currentUserId={childItem?.id}
                    parentId={childItem.parentId}
                    content={childItem.text}
                    author={childItem.author}
                    community={childItem.community}
                    createdAt={childItem.createdAt}
                    comments={childItem.children}
                    isComment={true}/>
                ))}
            </div>
        </section>
    )
}

