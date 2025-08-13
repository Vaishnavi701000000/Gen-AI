// // pages/login.tsx
// import React, { useState } from "react";
// import { useRouter } from "next/router";

// const LoginPage = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.message || "Login failed");
//         return;
//       }

//       // Check if admin
//       if (data.user.role === "admin") {
//         router.push("/admin-dashboard"); // 👈 Admin redirect
//       } else {
//         router.push("/dashboard"); // 👈 Normal user redirect
//       }
//     } catch (err) {
//       setError("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Login</h2>
//         {error && <div className="text-red-500 mb-3">{error}</div>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//           required
//         />
//         <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
// src/pages/login.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
