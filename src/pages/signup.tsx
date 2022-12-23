import React, { useState } from "react";
import Router from "next/router";
import { trpc } from "../utils/trpc";
import Layout from "../components/Layout";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const userMutation = trpc.user.createUser.useMutation();

  // submit user info

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { name, email };
      await userMutation.mutateAsync(body);
      await Router.push("/drafts");
    } catch (error) {
      console.error({ error }, "Failed to create user");
    }
  };

  return (
    <Layout>
      <div className="page">
        <form onSubmit={submitData}>
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="text"
            value={email}
          />
          <input disabled={!name || !email} type="submit" value="Signup" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
        }

        input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default SignUp;
