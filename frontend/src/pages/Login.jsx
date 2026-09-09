import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import SmartCityVisual from "../components/landing/SmartCityVisual";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user, response.data.token);

      const role = response.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "worker") navigate("/worker/dashboard");
      else navigate("/citizen/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await api.post("/auth/google", { idToken });
      login(response.data.user, response.data.token);

      const role = response.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "worker") navigate("/worker/dashboard");
      else navigate("/citizen/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google Sign-In failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT - Smart City Visual */}
      <div className="relative hidden w-[45%] overflow-hidden bg-navy-900 lg:block">
        <SmartCityVisual className="absolute inset-0 h-full w-full" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-navy-950/80 via-navy-900/50 to-transparent p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-lg shadow-primary-600/30">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">CivicResolve</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Municipal Services</p>
            </div>
          </div>

          <div className="max-w-sm">
            <h2 className="text-3xl font-bold leading-tight text-white">Your city.</h2>
            <h2 className="text-3xl font-bold leading-tight text-primary-400">Your voice.</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Connect with your community and track the issues that matter.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT - Auth Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-navy-900">CivicResolve</h1>
            <p className="mt-1 text-sm text-slate-500">Municipal Services Portal</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-500">Sign in to the Municipal Services Portal</p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label mb-0">Password</label>
                <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pl-10 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 shadow-lg shadow-primary-600/25"
            >
              {loading ? "Signing in..." : "Login"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="mx-4 text-xs text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="btn-secondary w-full justify-center py-3"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;