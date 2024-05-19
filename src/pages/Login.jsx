import useLogin from "../hooks/useLogin";

import { Form, Link } from "react-router-dom";

function Login() {
  const { loginWithGoogle } = useLogin();
  return (
    <div className="grid place-items-center min-h-screen">
      <Form
        className="w-96 flex flex-col bg-white p-10 rounded-lg shadow-lg"
        method="post"
      >
        <h1 className="text-center mb-5 font-bold text-4xl">Login</h1>
        <label className="form-control w-full mb-3">
          <div className="label">
            <span className="label-text">Email:</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </label>
        <label className="form-control w-full mb-3">
          <div className="label">
            <span className="label-text">Password:</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </label>
        <div className="mb-2">
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={loginWithGoogle}
          >
            Google
          </button>
        </div>
        <button
          type="button"
          className="btn btn-neutral mb-3"
          onClick={loginWithGoogle}
          disabled
        >
          Login
        </button>
        <p className="text-center">
          Already member ?{" "}
          <Link to="/signup" className="link link-primary">
            Signup
          </Link>
        </p>
      </Form>
    </div>
  );
}

export default Login;
