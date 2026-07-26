import { FcGoogle } from "react-icons/fc";

function GoogleButton() {
  return (
    <button
      className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3"
    >
      <FcGoogle size={24} />
      Continue with Google
    </button>
  );
}

export default GoogleButton;