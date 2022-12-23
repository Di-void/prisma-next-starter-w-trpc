import React from "react";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { trpc } from "../../utils/trpc";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";

// ssr
export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const id = context.params?.id as string;

  await ssg.post.getSinglePost.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

const Post = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { id } = props;

  const utils = trpc.useContext();
  // query will be immediately available as it's prefetched
  const postQuery = trpc.post.getSinglePost.useQuery({ id });

  // mutation for publishing a post
  const publishMutation = trpc.post.publishPost.useMutation({
    //   refetches the posts after this mutation is successful
    async onSuccess() {
      await utils.post.getPosts.invalidate();
    },
  });

  // mutation for deleteing post
  const deleteMutation = trpc.post.deletePost.useMutation({
    //   refetches the posts after this mutation is successful
    async onSuccess() {
      await utils.post.getPosts.invalidate();
    },
  });

  const { data } = postQuery;
  let title = data?.title || "NIL";
  if (!data?.published) {
    title = `${title} (Draft)`;
  }

  // publish post function
  async function publish(id: number): Promise<void> {
    publishMutation.mutate({
      id,
    });

    await Router.push("/");
  }

  // delete post function
  async function destroy(id: number): Promise<void> {
    deleteMutation.mutate({
      id,
    });

    await Router.push("/");
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {data?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={data?.content!} />
        {!data!.published && (
          <button onClick={() => publish(data!.id)}>Publish</button>
        )}
        <button onClick={() => destroy(data!.id)}>Delete</button>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
