import Link from 'next/link';
import {
  PostSnippetFragment,
  useCurrentUserQuery,
} from '../generated/generated-types';
import { timeAgo } from '../utils/timeAgo';
import { UpdootSection } from './UpdootSection';

interface PostProps {
  post: PostSnippetFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const { data } = useCurrentUserQuery();

  const isOwner = data?.currentUser?._id === post.creator._id;

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
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex gap-2">
              <h2 className="font-bold">
                Posted by{' '}
                {isOwner ? (
                  <span className="text-bright_crimson-1">
                    {post.creator.username}
                  </span>
                ) : (
                  <span>{post.creator.username}</span>
                )}{' '}
              </h2>
              {timeAgo(post.createdAt)}
            </div>
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
