import { useRouter } from 'next/router';
import { ClockLoader } from 'react-spinners';
import { useGetPostQuery } from '../../generated/generated-types';

const PostPage = () => {
  const router = useRouter();
  const routerID =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;

  const { data, loading } = useGetPostQuery({
    skip: routerID === -1,
    variables: { getPostId: routerID },
  });

  if (loading)
    return (
      <div className="w-full pt-20 flex justify-center">
        <ClockLoader />
      </div>
    );

  if (!data?.getPost)
    return (
      <div className="w-full pt-20 flex justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight mdl:text-5xl lg:text-6xl">
          Post doesn't exist
        </h1>
      </div>
    );

  return (
    <div className="pt-10 w-full flex flex-col items-center">
      <div className="w-2/5 flex flex-col items-center">
        <h1 className="mb-3 text-3xl font-extrabold leading-none tracking-tight mdl:text-4xl lg:text-5xl">
          {data.getPost.title}
        </h1>
        <div className="border-b w-full border-gray-300 my-2" />
        <p className="w-full whitespace-normal break-words">
          {data.getPost.text}
        </p>
      </div>
    </div>
  );
};

export default PostPage;
