import { Updoot } from './Updoot';

interface PostProps {
  post: {
    __typename?: 'Post' | undefined;
    _id: number;
    title: string;
    textSnippet: string;
    createdAt: string;
    updatedAt: string;
    points: number;
    creator: {
      __typename?: 'User' | undefined;
      _id: number;
      username: string;
    };
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="h-36 rounded-md border border-gray-300 m-2 py-5 px-4 flex gap-4 shadow-md">
      <Updoot points={post.points} />
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-3xl font-semibold">{post.title}</h1>
          <h2>Posted by {post.creator.username}</h2>
        </div>
        <p>{post.textSnippet}</p>
      </div>
    </div>
  );
};
