import Link from 'next/link';
import { Post } from '../components/Post';
import { useGetPostsQuery } from '../generated/generated-types';
import { ClockLoader } from 'react-spinners';
import { ScrollTop } from '../components/ScrollTop';
import { useIsScrolled } from '../hooks/useIsScrolled';

const Home = () => {
  const isScrolled = useIsScrolled();

  const { data, loading, fetchMore, variables } = useGetPostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
  });

  if (loading || !data)
    return (
      <div className="w-full mt-6 flex flex-col items-center">
        <ClockLoader color="green" />
      </div>
    );

  return (
    <div className="w-full mt-6 flex flex-col items-center">
      {isScrolled ? <ScrollTop /> : null}
      <div className="w-2/5 px-2 flex items-center justify-between">
        <h1 className="text-2xl inline font-extrabold leading-none mdl:text-3xl lg:text-4xl">
          Main page
        </h1>
        <Link href={'/create-post'}>
          <button
            type="submit"
            className="h-12 py-2.5 px-5 bg-bright_crimson-1 hover:bg-bright_crimson-2 font-medium rounded-lg text-center"
          >
            Create a Post
          </button>
        </Link>
      </div>
      <div className="w-2/5">
        {data.getPosts.posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
      {data.getPosts.hasMore ? (
        <button
          onClick={() => {
            fetchMore({
              variables: {
                limit: variables?.limit,
                cursor:
                  data?.getPosts.posts[data.getPosts.posts.length - 1]
                    .createdAt,
              },
            });
          }}
          className="my-6 w-36 h-12 py-2.5 px-5 bg-bright_crimson-1 hover:bg-bright_crimson-2  text-white font-medium rounded-lg text-center"
        >
          More posts
        </button>
      ) : null}
    </div>
  );
};

export default Home;
