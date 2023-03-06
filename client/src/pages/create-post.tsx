import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SubmitButton } from '../components/SubmitButton';
import { useCreatePostMutation } from '../generated/generated-types';
import { PostInput as Post } from '../generated/generated-types';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost = () => {
  useIsAuth();

  const [post, setPost] = useState<Post>({ title: '', text: '' });
  const [emptyTitle, setEmptyTitle] = useState(false);

  const [createPost, { loading }] = useCreatePostMutation();

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (post.title.length === 0) {
      setEmptyTitle(true);
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
              className={`bg-gray-50 border-2 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5 
            ${emptyTitle ? 'bg-red-400' : null}`}
            />
            {emptyTitle ? (
              <p className="pl-2 text-red-400">
                Posts can't have an empty title
              </p>
            ) : null}
          </div>
          <textarea
            onChange={(e) => {
              setPost({ ...post, text: e.target.value });
            }}
            value={post.text}
            placeholder="text"
            className="h-32 bg-gray-50 border-2 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5"
          />
        </div>
        <SubmitButton name="Create post" loading={loading} />
      </form>
    </div>
  );
};

export default CreatePost;
