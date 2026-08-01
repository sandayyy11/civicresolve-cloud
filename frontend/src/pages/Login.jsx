import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import GoogleButton from "../components/auth/GoogleButton";
import PasswordInput from "../components/auth/PasswordInput";
import TextInput from "../components/auth/TextInput";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
const { login } = useAuth();

const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    login(response.data.user, response.data.token);

    const role = response.data.user.role;

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "worker") {
      navigate("/worker/dashboard");
    } else {
      navigate("/citizen/dashboard");
    }

  } catch (error) {
    alert(
      error.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Sign in to your CivicResolve account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">
                Password
              </label>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <PasswordInput
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4"
            />

            <label htmlFor="remember" className="text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        
        

        <div className="flex items-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        <GoogleButton />

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;