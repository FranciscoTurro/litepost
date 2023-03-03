import Link from 'next/link';
import { Post } from '../components/Post';
import { useGetPostsQuery } from '../generated/generated-types';
import { ClockLoader } from 'react-spinners';

const Home = () => {
  const { data, loading } = useGetPostsQuery({
    variables: {
      limit: 10,
    },
  });

  if (loading)
    return (
      <div className="w-full mt-6 flex flex-col items-center">
        <ClockLoader color="green" />
      </div>
    );

  return (
    <div className="w-full mt-6 flex flex-col items-center">
      <div className="w-2/5 flex items-center justify-between">
        <h1 className="mb-4 m-2 text-2xl inline font-extrabold leading-none mdl:text-3xl lg:text-4xl">
          Main page
        </h1>
        <Link href={'/create-post'}>Create a post</Link>
      </div>
      <div className="w-2/5">
        {data
          ? data.getPosts.map((post) => <Post post={post} key={post._id} />)
          : null}
      </div>
      <button className="my-6 w-36 h-12 py-2.5 px-5 bg-bright_crimson-1 hover:bg-bright_crimson-2  text-white font-medium rounded-lg text-center">
        Load more
      </button>
    </div>
  );
};

export default Home;
