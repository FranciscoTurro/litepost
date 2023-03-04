interface PostProps {
  post: {
    __typename?: 'Post' | undefined;
    _id: number;
    title: string;
    textSnippet: string;
    createdAt: string;
    updatedAt: string;
    creator: {
      __typename?: 'User' | undefined;
      _id: number;
      username: string;
    };
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="rounded-md border border-gray-300 m-2 py-5 px-4 flex flex-col gap-2 shadow-md">
      <h1 className="text-2xl font-semibold">
        {post.title} with id {post._id}
      </h1>
      <p>
        {post.textSnippet} created by {post.creator.username}
      </p>
    </div>
  );
};
