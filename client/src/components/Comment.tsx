import { Trashcan } from '../assets/svg/Trashcan';
import {
  GetCommentsQuery,
  useCurrentUserQuery,
  useDeleteCommentMutation,
} from '../generated/generated-types';
import { timeAgo } from '../utils/timeAgo';

interface CommentProps {
  comment: GetCommentsQuery['getComments']['comments'][0];
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  const { data } = useCurrentUserQuery();

  const [deleteComment, { loading }] = useDeleteCommentMutation();

  const isOwner = data?.currentUser!._id !== comment.user._id;

  return (
    <div className="flex justify-between rounded-lg bg-custom_gray-6 p-4 border-2 border-custom_gray-7">
      <div>
        <div className="flex gap-2">
          <p className="flex gap-1 text-sm text-custom_gray-3 font-extrabold">
            Posted by
            {isOwner ? (
              <p>{comment.user.username}</p>
            ) : (
              <p className="text-bright_crimson-1">{comment.user.username}</p>
            )}
          </p>
          <p className="text-sm text-custom_gray-3">
            {timeAgo(comment.createdAt)}
          </p>
        </div>
        <p className="text-lg">{comment.text}</p>
      </div>
      {isOwner ? null : (
        <button
          disabled={loading}
          onClick={() => {
            deleteComment({
              variables: { deleteCommentId: comment._id },
              update: (cache) => {
                cache.evict({ fieldName: 'getComments:{}' });
              },
            });
          }}
        >
          <Trashcan />
        </button>
      )}
    </div>
  );
};
