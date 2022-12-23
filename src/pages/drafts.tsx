import React from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import superjson from "superjson";
import { trpc } from "../utils/trpc";
import { appRouter } from "../server/trpc/router/_app";
import { createContext } from "../server/trpc/context";
import { GetServerSideProps } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

export const getServerSideProps: GetServerSideProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.post.getDrafts.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

const Drafts = () => {
  // query will be immediately available
  const { data } = trpc.post.getDrafts.useQuery();

  return (
    <Layout>
      <div className="page">
        <h1>Drafts</h1>
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

export default Drafts;
