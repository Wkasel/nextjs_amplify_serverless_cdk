// pages/posts/[id].js
import { API } from "aws-amplify";
import { getPostById, listPosts } from "../../graphql";
import "../../configureAmplify";
import { useRouter } from "next/router";
import Comments from "../../components/Comments";
import checkUser from "../../services/clientAuth";

export default function Post({ post }) {
  const router = useRouter();
  const user = checkUser();
  if (router.isFallback) return <div>Loading...</div>;
  return (
    <div>
      <h2>{post.name}</h2>
      <p>{post.content}</p>
      <span>By: {post.username}</span>
      {user && <Comments postId={post.id} />}
    </div>
  );
}

export async function getStaticPaths() {
  const postData = await API.graphql({ query: listPosts });
  const postIds = postData.data.listPosts.map((post) => ({
    params: { id: post.id },
  }));
  console.log(postIds);
  return {
    paths: postIds,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const postId = context.params.id;
  console.log({ postId });
  const post = await API.graphql({ query: getPostById, variables: { postId } });
  return {
    props: {
      post: post.data.getPostById,
    },
  };
}
