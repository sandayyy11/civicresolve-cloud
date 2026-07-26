import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ placeholder ,
  value,
  onChange,}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
  type={showPassword ? "text" : "password"}
  placeholder={placeholder}
  value={value}
  onChange={onChange}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default PasswordInput;