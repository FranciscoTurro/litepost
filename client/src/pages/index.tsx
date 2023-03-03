import Link from 'next/link';
import { useGetPostsQuery } from '../generated/generated-types';

const Home = () => {
  const { data } = useGetPostsQuery({
    variables: {
      limit: 10,
    },
  });

  return (
    <>
      <Link className="bg-red-800 flex" href={'/create-post'}>
        FAST WAY TO CREATE POST, CHANGE LATER
      </Link>
      <div>main page</div>
      <br />
      {data
        ? data.getPosts.map((post) => <div key={post._id}>{post.title}</div>)
        : null}
    </>
  );
};

export default Home;
