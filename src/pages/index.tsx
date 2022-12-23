import { GetServerSideProps } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import React from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import superjson from "superjson";
import { trpc } from "../utils/trpc";
import { appRouter } from "../server/trpc/router/_app";
import { createContext } from "../server/trpc/context";

export const getServerSideProps: GetServerSideProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.post.getPosts.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

const Blog = () => {
  // query is supposedly immediately available as
  // it has already been prefetched
  const postsQuery = trpc.post.getPosts.useQuery();

  const { data } = postsQuery;
  return (
    <Layout>
      <div className="page">
        <h1>My Blog</h1>
        <main>
          {data?.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
