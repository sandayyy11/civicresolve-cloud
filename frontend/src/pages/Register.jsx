import { Link } from "react-router-dom";
import GoogleButton from "../components/auth/GoogleButton";
import PasswordInput from "../components/auth/PasswordInput";
import TextInput from "../components/auth/TextInput";

function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Join CivicResolve and help build smarter cities.
        </p>

        <form className="mt-8 space-y-5">

          <TextInput
  label="Full Name"
  type="text"
  placeholder="Enter your full name"
/>

          <TextInput
  label="Email"
  type="email"
  placeholder="Enter your email"
/>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <PasswordInput placeholder="Enter your password" />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            Create Account
          </button>

        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        <GoogleButton />

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;