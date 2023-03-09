import { ApolloCache, gql } from '@apollo/client';
import { ArrowDown } from '../assets/svg/ArrowDown';
import { ArrowUp } from '../assets/svg/ArrowUp';
import { useVoteMutation, VoteMutation } from '../generated/generated-types';

interface UpdootSectionProps {
  postId: number;
  points: number;
  voteStatus: number | null | undefined;
  isHorizontal?: boolean;
}

const greenHexCode: string = '#00FF00';
const redHexCode: string = '#FF0000';

const updatePoints = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    _id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post {
        _id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      const newPoints = data.points - data.voteStatus;
      cache.writeFragment({
        id: 'Post:' + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: null },
      });
    } else {
      const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
      cache.writeFragment({
        id: 'Post:' + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value },
      });
    }
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({
  points,
  postId,
  voteStatus,
  isHorizontal,
}) => {
  const [vote, { loading }] = useVoteMutation();

  const handleUpdoot = async () => {
    await vote({
      variables: { postId: postId, value: 1 },
      update: (cache) => updatePoints(1, postId, cache),
    });
  };

  const handleDowndoot = async () => {
    await vote({
      variables: { postId: postId, value: -1 },
      update: (cache) => updatePoints(-1, postId, cache),
    });
  };

  return (
    <div
      className={`h-full flex justify-between w-6 ${
        isHorizontal ? 'gap-3' : ' flex-col'
      }`}
    >
      <button disabled={loading} onClick={handleUpdoot}>
        <ArrowUp color={voteStatus === 1 ? greenHexCode : 'white'} />
      </button>
      <p className="text-center">{points}</p>
      <button disabled={loading} onClick={handleDowndoot}>
        <ArrowDown color={voteStatus === -1 ? redHexCode : 'white'} />
      </button>
    </div>
  );
};
