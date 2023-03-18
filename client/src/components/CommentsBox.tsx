import { FormEvent, useState } from 'react';
import { useCreateCommentMutation } from '../generated/generated-types';
import { useIsAuth } from '../hooks/useIsAuth';
import { SubmitButton } from './SubmitButton';

interface CommentsBoxProps {
  postId: number;
}

export const CommentsBox: React.FC<CommentsBoxProps> = ({ postId }) => {
  useIsAuth();

  const [createComment, { loading }] = useCreateCommentMutation();

  const [textLength, setTextLength] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.length === 0) {
      setEmpty(true);
      return;
    }
    if (comment.length >= 255) {
      setTextLength(true);
      return;
    }
    await createComment({ variables: { text: comment, postId } });
    setComment('');
  };

  return (
    <div className="w-2/5">
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => {
            setEmpty(false);
            setTextLength(false);
            setComment(e.target.value);
          }}
          placeholder="Anything to say?"
          className={`h-24 border-2 outline-none border-custom_gray-6 text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5 
            ${
              textLength || empty ? 'bg-bright_crimson-1' : 'bg-custom_gray-5 '
            }`}
        />
        {textLength ? (
          <p className="pl-2 text-bright_crimson-1">
            Comments have a maximum of 255 characters
          </p>
        ) : null}
        {empty ? (
          <p className="pl-2 text-bright_crimson-1">Comments can't be empty</p>
        ) : null}
        <div className="flex justify-between items-center">
          <SubmitButton name="Comment" loading={loading} />
          <p
            className={`p-2 ${
              comment.length >= 255 ? 'text-bright_crimson-1' : null
            }`}
          >
            {comment.length}/255
          </p>
        </div>
      </form>
    </div>
  );
};
