import { GetCommentsQuery } from '../generated/generated-types';

interface CommentProps {
  comment: GetCommentsQuery['getComments']['comments'][0];
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return <div>{comment.text}</div>;
};
