import { Navbar } from '../components/Navbar';
import { useGetPostsQuery } from '../generated/generated-types';

const Home = () => {
  const { data } = useGetPostsQuery();

  return (
    <>
      <Navbar />
      <div>main page</div>
      <br />
      {data
        ? data.getPosts.map((post) => <div key={post._id}>{post.title}</div>)
        : null}
    </>
  );
};

export default Home;
