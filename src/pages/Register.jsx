// react router dom imports
import { Link, Form, useActionData } from "react-router-dom";
import FormInput from "../components/FormInput";

// custom register hook
import { useRegister } from "../hooks/useRegister";
import { useLogin } from "../hooks/useLogin";
import { useEffect } from "react";

export const action = async ({ request }) => {
  let formData = await request.formData();
  let displayName = formData.get("displayName");
  let url = formData.get("url");
  let email = formData.get("email");
  let password = formData.get("password");

  return {
    displayName,
    url,
    email,
    password,
  };
};

function Register() {
  const { register, isPending } = useRegister();
  const { loginWithGoogle } = useLogin();

  const userData = useActionData();

  useEffect(() => {
    if (userData) {
      const { displayName, url, email, password } = userData;
      register(displayName, url, email, password);
    }
  }, [userData]);

  return (
    <div className="grid place-items-center min-h-screen">
      <Form
        className="w-96 flex flex-col bg-white p-10 rounded-lg shadow-lg"
        method="post"
      >
        <h1 className="text-center mb-5 font-bold text-4xl">Register</h1>
        <FormInput name="displayName" type="text" label="Display Name" />
        <FormInput name="url" type="url" label="Image URL" />
        <FormInput name="email" type="email" label="Email" />
        <FormInput name="password" type="password" label="Password" />

        <div className="mb-2">
          <button
            onClick={loginWithGoogle}
            type="button"
            className="btn btn-primary btn-block"
          >
            Google
          </button>
        </div>
        <button type="submit" className="btn btn-neutral mb-3">
          {isPending ? "Loading..." : "Register"}
        </button>
        <p className="text-center">
          Already member ?
          <Link to="/login" className="link link-primary">
            Login
          </Link>
        </p>
      </Form>
    </div>
  );
}

export default Register;
