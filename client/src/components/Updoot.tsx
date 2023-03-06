import { ArrowDown } from '../assets/svg/ArrowDown';
import { ArrowUp } from '../assets/svg/ArrowUp';
import { useVoteMutation } from '../generated/generated-types';

interface UpdootProps {
  points: number;
  postID: number;
}

export const Updoot: React.FC<UpdootProps> = ({ points, postID }) => {
  const [vote, { loading }] = useVoteMutation();

  const handleUpdoot = async () => {
    await vote({
      variables: { postId: postID, value: 1 },
    });
  };

  const handleDowndoot = async () => {
    await vote({
      variables: { postId: postID, value: -1 },
    });
  };

  return (
    <div className="h-full flex flex-col justify-between w-6">
      <button disabled={loading} onClick={handleUpdoot}>
        <ArrowUp />
      </button>
      <p className="text-center">{points}</p>
      <button disabled={loading} onClick={handleDowndoot}>
        <ArrowDown />
      </button>
    </div>
  );
};
