import React from "react";
import { RouterOutputs } from "../utils/trpc";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = RouterOutputs["post"]["getSinglePost"];

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post?.author ? post?.author.name : "Unknown Author";
  return (
    // programmatically navigate to the single post page
    <div onClick={() => Router.push("p/[id]", `p/${post?.id}`)}>
      <h2>{post?.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post?.content!} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
