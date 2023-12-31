import Image from 'next/image'
import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from '@/lib/actions/whisper.actions';
import { resourceLimits } from 'worker_threads';
import { currentUser } from '@clerk/nextjs';
import ThreadCard from '@/components/cards/ThreadCard';



export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();
  console.log(result)

  return (
    <>
      <h1 className='head-text text-left text-white'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        <div>
          {result.posts.length === 0 ?
            (<p className='no-result'>No threads found</p>)
            :
            (
              <div>
                {result.posts.map((post) =>
                (
                  <ThreadCard
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
                )
                )}
              </div>
            )}
        </div>
      </section>
    </>
  )
}

