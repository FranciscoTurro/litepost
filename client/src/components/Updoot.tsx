import { ArrowDown } from '../assets/svg/ArrowDown';
import { ArrowUp } from '../assets/svg/ArrowUp';
import {
  PostSnippetFragment,
  useVoteMutation,
} from '../generated/generated-types';

interface UpdootProps {
  post: PostSnippetFragment;
}

export const Updoot: React.FC<UpdootProps> = ({ post }) => {
  const [vote, { loading }] = useVoteMutation();

  const handleUpdoot = async () => {
    await vote({
      variables: { postId: post._id, value: 1 },
    });
  };

  const handleDowndoot = async () => {
    await vote({
      variables: { postId: post._id, value: -1 },
    });
  };

  return (
    <div className="h-full flex flex-col justify-between w-6">
      <button disabled={loading} onClick={handleUpdoot}>
        <ArrowUp />
      </button>
      <p className="text-center">{post.points}</p>
      <button disabled={loading} onClick={handleDowndoot}>
        <ArrowDown />
      </button>
    </div>
  );
};
