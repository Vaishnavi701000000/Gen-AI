import { useState } from "react";

export default function ForgotPassword() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        <input
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          onClick={handleReset}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
