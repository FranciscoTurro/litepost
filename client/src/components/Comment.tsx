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

  let isOwner;

  if (!data?.currentUser) {
    isOwner = false;
  } else {
    isOwner = data.currentUser!._id === comment.user._id;
  }

  return (
    <div className="flex justify-between rounded-lg bg-custom_gray-6 p-4 border-2 border-custom_gray-7">
      <div className="w-96 whitespace-normal break-words ">
        <div className="flex gap-2">
          <p className="flex text-sm text-custom_gray-3 font-extrabold">
            {isOwner ? (
              <span className="text-bright_crimson-1">
                {comment.user.username}
              </span>
            ) : (
              <span>{comment.user.username}</span>
            )}
          </p>
          <p className="text-sm text-custom_gray-3">
            {timeAgo(comment.createdAt)}
          </p>
        </div>
        <p className="text-lg">{comment.text}</p>
      </div>
      {isOwner ? (
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
      ) : null}
    </div>
  );
};
