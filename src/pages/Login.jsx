// custom hooks
import { useLogin } from "../hooks/useLogin";

// react imports
import { useEffect } from "react";

// react router dom imports
import { Form, Link, useActionData } from "react-router-dom";

// components
import FormInput from "../components/FormInput";

// action
export const action = async ({ request }) => {
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  console.log(email, password);
  return {
    email,
    password,
  };
};

function Login() {
  const { loginWithGoogle, loginWithEmail, isPending } = useLogin();

  const userData = useActionData();

  useEffect(() => {
    if (userData) {
      const { email, password } = userData;
      loginWithEmail(email, password);
    }
  }, [userData]);

  return (
    <div className="grid place-items-center min-h-screen">
      <Form
        className="w-96 flex flex-col bg-white p-10 rounded-lg shadow-lg"
        method="post"
      >
        <h1 className="text-center mb-5 font-bold text-4xl">Login</h1>
        <FormInput name="email" type="email" label="Email" />
        <FormInput name="password" type="password" label="Password" />

        <div className="mb-2">
          <button
            onClick={loginWithGoogle}
            type="button"
            className="btn btn-primary btn-block"
          >
            {isPending ? "Loading..." : "Google"}
          </button>
        </div>
        <button type="submit" className="btn btn-neutral mb-3">
          {isPending ? "Loading..." : "Login"}
        </button>
        <p className="text-center">
          Already member ?
          <Link to="/register" className="link link-primary">
            Register
          </Link>
        </p>
      </Form>
    </div>
  );
}

export default Login;
