import { FcGoogle } from "react-icons/fc";

function GoogleButton({ onClick, loading = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="btn-secondary w-full"
    >
      <FcGoogle size={20} />
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}

export default GoogleButton;