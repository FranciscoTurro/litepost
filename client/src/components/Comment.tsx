import { GetCommentsQuery } from '../generated/generated-types';
import { timeAgo } from '../utils/timeAgo';

interface CommentProps {
  comment: GetCommentsQuery['getComments']['comments'][0];
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="rounded-lg bg-custom_gray-6 p-4 border-2 border-custom_gray-7">
      <div className="flex gap-2">
        <p className="text-sm text-custom_gray-3 font-extrabold">
          {comment.user.username}
        </p>
        <p className="text-sm text-custom_gray-3">
          {timeAgo(comment.createdAt)}
        </p>
      </div>
      <p className="text-lg">{comment.text}</p>
    </div>
  );
};
