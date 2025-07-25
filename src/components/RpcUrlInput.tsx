import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface RpcUrlInputProps {
  rpcUrl: string;
  setRpcUrl: React.Dispatch<React.SetStateAction<string>>;
}

const RpcUrlInput: React.FC<RpcUrlInputProps> = ({ rpcUrl, setRpcUrl }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type={isPasswordVisible ? "text" : "password"}
        placeholder="Enter your RPC URL (prefer Helius)"
        className="px-4 py-2 rounded-lg bg-nos-dark-surface text-nos-text-light border border-nos-text-light focus:outline-none focus:ring-2 focus:ring-neon-green w-80"
        value={rpcUrl}
        onChange={(e) => setRpcUrl(e.target.value)}
        autoComplete="off"
      />
      <button
        onClick={togglePasswordVisibility}
        className="p-2 rounded-full bg-nos-dark-surface text-nos-text-light hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-green"
      >
        {isPasswordVisible ? (
          // Eye-slash icon (hide)
          <FiEyeOff className="w-5 h-5" />
        ) : (
          // Eye icon (show)
          <FiEye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default RpcUrlInput;
