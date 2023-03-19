import { useApolloClient } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ClockLoader } from 'react-spinners';
import { Edit } from '../../assets/svg/Edit';
import { Trashcan } from '../../assets/svg/Trashcan';
import { CommentsBox } from '../../components/CommentsBox';
import { UpdootSection } from '../../components/UpdootSection';
import {
  useCurrentUserQuery,
  useDeletePostMutation,
  useGetPostQuery,
} from '../../generated/generated-types';

const PostPage = () => {
  const client = useApolloClient();
  client.cache.evict({ fieldName: 'getComments' });
  client.cache.gc();

  const router = useRouter();

  const routerID =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;

  const [deletePost, {}] = useDeletePostMutation();

  const { data: userData } = useCurrentUserQuery();

  const { data, loading } = useGetPostQuery({
    skip: routerID === -1,
    variables: { getPostId: routerID },
  });

  const handleDelete = () => {
    deletePost({
      variables: { deletePostId: data!.getPost!._id },
      update: (cache) => {
        cache.evict({ fieldName: 'getPosts:{}' });
      },
    });
    router.push('/');
  };

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
    <div className="pt-10 w-full flex flex-col items-center gap-6">
      <div className="w-2/5 flex flex-col items-center">
        <h1 className="mb-3 text-3xl font-extrabold leading-none tracking-tight mdl:text-4xl lg:text-5xl">
          {data.getPost.title}
        </h1>
        <div className="border-b w-full border-gray-300 my-2" />
        <p className="w-full text-xl whitespace-normal break-words">
          {data.getPost.text}
        </p>
      </div>
      <div className="w-2/5 flex gap-5">
        <div className="pr-16">
          <UpdootSection
            points={data.getPost.points}
            postId={data.getPost._id}
            voteStatus={data.getPost.voteStatus}
            isHorizontal={true}
          />
        </div>
        {data.getPost.creator._id === userData?.currentUser?._id ? (
          <>
            <button>
              <Link href={`/post/edit/${data.getPost?._id}`}>
                <Edit />
              </Link>
            </button>
            <button onClick={handleDelete}>
              <Trashcan />
            </button>
          </>
        ) : null}
      </div>
      <CommentsBox postId={data.getPost._id} />
    </div>
  );
};

export default PostPage;
