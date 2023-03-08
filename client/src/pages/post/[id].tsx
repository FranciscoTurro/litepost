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

  return <div>{JSON.stringify(data)}</div>;
};

export default PostPage;
