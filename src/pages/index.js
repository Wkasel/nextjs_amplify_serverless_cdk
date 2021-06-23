import { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "aws-amplify";
import { listPosts } from "../graphql";

const linkStyle = {
  cursor: "pointer",
  borderBottom: "1px solid rgba(0, 0, 0 ,.1)",
  padding: "20px 0px",
};
const authorStyle = { color: "rgba(0, 0, 0, .55)", fontWeight: "600" };

export default function Home({ posts }) {
  // const [posts, setPosts] = useState([])
  // useEffect(() => {
  //   fetchPosts()
  // }, [])
  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}>
          <div style={linkStyle}>
            <h2>{post.title}</h2>
            <p style={authorStyle}>Author: {post.owner}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export async function getServerSideProps(req, res) {
  try {
    const postData = await API.graphql({
      query: listPosts,
    });
    return {
      props: {
        posts: postData.data.listPosts,
      },
    };
  } catch (e) {
    console.log("Error fetching posts");
  }
}
