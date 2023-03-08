import { ApolloCache, gql } from '@apollo/client';
import { ArrowDown } from '../assets/svg/ArrowDown';
import { ArrowUp } from '../assets/svg/ArrowUp';
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from '../generated/generated-types';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

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

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [vote, { loading }] = useVoteMutation();

  const handleUpdoot = async () => {
    await vote({
      variables: { postId: post._id, value: 1 },
      update: (cache) => updatePoints(1, post._id, cache),
    });
  };

  const handleDowndoot = async () => {
    await vote({
      variables: { postId: post._id, value: -1 },
      update: (cache) => updatePoints(-1, post._id, cache),
    });
  };

  return (
    <div className="h-full flex flex-col justify-between w-6">
      <button disabled={loading} onClick={handleUpdoot}>
        <ArrowUp color={post.voteStatus === 1 ? 'green' : 'white'} />
      </button>
      <p className="text-center">{post.points}</p>
      <button disabled={loading} onClick={handleDowndoot}>
        <ArrowDown color={post.voteStatus === -1 ? 'red' : 'white'} />
      </button>
    </div>
  );
};
