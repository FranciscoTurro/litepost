import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SubmitButton } from '../components/SubmitButton';
import { useCreatePostMutation } from '../generated/generated-types';
import { PostInput as Post } from '../generated/generated-types';
import { useIsAuth } from '../hooks/useIsAuth';

const CreatePost = () => {
  useIsAuth();

  const [post, setPost] = useState<Post>({ title: '', text: '' });
  const [emptyTitle, setEmptyTitle] = useState(false);
  const [textLength, setTextLength] = useState(false);

  const [createPost, { loading }] = useCreatePostMutation();

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (post.title.length === 0) {
      setEmptyTitle(true);
      return;
    }
    if (post.text.length >= 255) {
      setTextLength(true);
      return;
    }
    await createPost({
      variables: { input: post },
      update: (cache) => {
        cache.evict({ fieldName: 'getPosts:{}' });
      },
    });
    router.push('/');
  };

  return (
    <div className="max-w-3xl w-full mt-8 mx-auto flex flex-col items-center">
      <form onSubmit={handleSubmit} autoComplete="off" className="w-3/4">
        <h1 className="mb-4 text-2xl font-extrabold leading-none mdl:text-3xl lg:text-4xl">
          Create a post
        </h1>
        <div className="mb-6 flex flex-col gap-2">
          <div>
            <input
              onChange={(e) => {
                setEmptyTitle(false);
                setPost({ ...post, title: e.target.value });
              }}
              value={post.title}
              placeholder="title"
              className={`border-2 border-custom_gray-6 outline-none text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5 
            ${emptyTitle ? 'bg-bright_crimson-1' : 'bg-custom_gray-5'}`}
            />
            {emptyTitle ? (
              <p className="pl-2 text-bright_crimson-1">
                Posts can't have an empty title
              </p>
            ) : null}
          </div>
          <textarea
            onChange={(e) => {
              setTextLength(false);
              setPost({ ...post, text: e.target.value });
            }}
            value={post.text}
            placeholder="text"
            className={`h-32 border-2 outline-none border-custom_gray-6 text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5 
            ${textLength ? 'bg-bright_crimson-1' : 'bg-custom_gray-5 '}`}
          />
          {textLength ? (
            <p className="pl-2 text-bright_crimson-1">
              Posts have a maximum of 255 characters
            </p>
          ) : null}
        </div>
        <div className="flex justify-between items-center">
          <SubmitButton name="Create post" loading={loading} />
          <p
            className={`p-2 ${
              post.text.length >= 255 ? 'text-bright_crimson-1' : null
            }`}
          >
            {post.text.length}/255
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
