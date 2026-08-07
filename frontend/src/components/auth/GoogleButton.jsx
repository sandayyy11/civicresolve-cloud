import { FcGoogle } from "react-icons/fc";

function GoogleButton({ onClick, loading = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <FcGoogle size={24} />
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}

export default GoogleButton;