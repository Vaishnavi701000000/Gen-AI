// // src/pages/signup.tsx
// import React from "react";
// import SignupForm from "@/components/SignupForm";

// const SignupPage = () => {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <SignupForm />
//     </div>
//   );
// };

// export default SignupPage;

// pages/signup.tsx


// import React, { useState } from "react";
// import { useRouter } from "next/router";

// const SignupPage = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.message || "Signup failed");
//         return;
//       }

//       setSuccess("Signup successful! Redirecting to login...");
//       setTimeout(() => {
//         router.push("/login");
//       }, 2000);
//     } catch (err) {
//       setError("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Sign Up</h2>
//         {error && <div className="text-red-500 mb-3">{error}</div>}
//         {success && <div className="text-green-600 mb-3">{success}</div>}
//         <input
//           type="text"
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="w-full mb-3 p-2 border rounded"
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="w-full mb-3 p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           className="w-full mb-3 p-2 border rounded"
//           required
//         />
//         <select
//           value={form.role}
//           onChange={(e) => setForm({ ...form, role: e.target.value })}
//           className="w-full mb-3 p-2 border rounded"
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignupPage;
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <SignupForm />
    </div>
  );
}
