import type { NextPage } from "next";
import { signIn } from "next-auth/react";

const LoginPage: NextPage = () => {
  return (
    <div>
      <button
        onClick={() => {
          return signIn("github");
        }}
      >
        Sign in with GitHub
      </button>
    </div>
  );
};

export default LoginPage;
