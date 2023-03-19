import { FormEvent, useState } from 'react';
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from '../generated/generated-types';
import { Comment } from './Comment';
import { ClockLoader } from 'react-spinners';

interface CommentsBoxProps {
  postId: number;
}

export const CommentsBox: React.FC<CommentsBoxProps> = ({ postId }) => {
  const { data, fetchMore, variables } = useGetCommentsQuery({
    variables: {
      limit: 10,
      postId,
      cursor: null,
    },
  });

  const [createComment, { loading }] = useCreateCommentMutation();

  const [textLength, setTextLength] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    await createComment({
      variables: { text: comment, postId },
      update: (cache) => {
        cache.evict({ fieldName: 'getComments:{}' });
      },
    });
    setComment('');
  };

  if (loading || !data)
    return (
      <div className="w-full mt-6 flex flex-col items-center">
        <ClockLoader color="green" />
      </div>
    );

  return (
    <div className="w-2/5">
      <form onSubmit={handleSubmit}>
        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={comment}
          onChange={(e) => {
            setEmpty(false);
            setTextLength(false);
            setComment(e.target.value);
          }}
          placeholder="Anything to say?"
          className={`focus:border-bright_crimson-1 rounded-t-lg p-2.5 h-24 border-x-2 border-t-2 outline-none border-custom_gray-6 text-sm block w-full  
            ${
              textLength || empty ? 'bg-bright_crimson-1' : 'bg-custom_gray-5 '
            }`}
        />
        <div
          className={`${
            isFocused ? 'border-bright_crimson-1' : 'border-custom_gray-6'
          } p-2 flex justify-between bg-custom_gray-6 border-x-2 border-b-2 rounded-b-lg`}
        >
          <p
            className={`${
              comment.length >= 255 ? 'text-bright_crimson-1' : null
            }`}
          >
            {comment.length}/255
          </p>
          <button
            className="bg-bright_crimson-1 hover:bg-bright_crimson-2 rounded-lg w-24"
            type="submit"
            disabled={loading}
          >
            Comment
          </button>
        </div>
        {textLength ? (
          <p className="pl-2 text-bright_crimson-1">
            Comments have a maximum of 255 characters
          </p>
        ) : null}
        {empty ? (
          <p className="pl-2 text-bright_crimson-1">Comments can't be empty</p>
        ) : null}
      </form>
      <div className="flex flex-col gap-2 mt-4 mb-8">
        <p className="text-lg inline font-extrabold leading-none mdl:text-xl lg:text-2xl">
          Comments:
        </p>
        {data?.getComments.comments.map((comment) => (
          <Comment comment={comment} key={comment._id} />
        ))}
        {data.getComments.hasMore ? (
          <button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data?.getComments.comments[
                      data.getComments.comments.length - 1
                    ].createdAt,
                },
              });
            }}
            className="my-6 w-36 h-12 py-2.5 px-5 bg-bright_crimson-1 hover:bg-bright_crimson-2 text-sm text-white font-medium rounded-lg text-center"
          >
            More comments
          </button>
        ) : null}
      </div>
    </div>
  );
};
