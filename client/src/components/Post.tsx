import Link from 'next/link';
import { PostSnippetFragment } from '../generated/generated-types';
import { UpdootSection } from './UpdootSection';

interface PostProps {
  post: PostSnippetFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="bg-custom_gray-6 h-36 rounded-md m-2 py-5 px-4 flex gap-4 shadow-md post hover:bg-custom_gray-5 transition-all">
      <UpdootSection
        points={post.points}
        postId={post._id}
        voteStatus={post.voteStatus}
      />
      <Link className="w-full" href={`post/${post._id}`}>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-3xl font-semibold">{post.title}</h1>
            <h2>Posted by {post.creator.username}</h2>
          </div>
          <p>
            {post.textSnippet}
            {post.textSnippet.length === 50 ? '... Read more' : null}
          </p>
        </div>
      </Link>
    </div>
  );
};
