

// // pages/api/auth/login.ts
// import { useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";

// export default function LoginForm() {
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const validateInputs = () => {
//     if (!userId.trim()) return "User ID is required";
//     if (!password.trim()) return "Password is required";
//     return "";
//   };

//   const handleLogin = async () => {
//     const validationError = validateInputs();
//     if (validationError) return setError(validationError);

//     setLoading(true);
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId, password }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);
//       localStorage.setItem("userId", data.userId);
//       router.push(data.role === "admin" ? "/admin-dashboard" : "/dashboard");
//     }
//     else {
//       setError(data.message || "Login failed");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow-md w-96">
//       <h2 className="text-2xl font-bold mb-4">Login</h2>
//       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//       <input
//         type="text"
//         placeholder="User ID"
//         value={userId}
//         onChange={(e) => setUserId(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       />
//       <button
//         onClick={handleLogin}
//         disabled={loading}
//         className="bg-purple-600 text-white w-full py-2 rounded"
//       >
//         {loading ? "Logging in..." : "Login"}
//       </button>
//       <div className="text-sm mt-3 text-center">
//         <Link href="/signup" className="text-blue-500 hover:underline">Create Account</Link>
//         <span className="mx-2">|</span>
//         <Link href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { FiUser, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";

// export default function LoginForm() {
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const validateInputs = () => {
//     if (!userId.trim()) return "User ID is required";
//     if (!password.trim()) return "Password is required";
//     return "";
//   };

//   const handleLogin = async () => {
//     const validationError = validateInputs();
//     if (validationError) return setError(validationError);

//     setLoading(true);
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId, password }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);
//       localStorage.setItem("userId", data.userId);
//       router.push(data.role === "admin" ? "/admin-dashboard" : "/dashboard");
//     }
//     else {
//       setError(data.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md overflow-hidden">
//         {/* Header with solid color */}
//         <div className="bg-purple-600 p-6 text-white">
//           <h1 className="text-3xl font-bold">Welcome Back</h1>
//           <p className="opacity-90">Sign in to your account</p>
//         </div>
        
//         {/* Form section */}
//         <div className="p-8">
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center border border-red-100">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//               {error}
//             </div>
//           )}

//           <div className="space-y-5">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//                 <FiUser className="h-5 w-5" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="User ID"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>

//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//                 <FiLock className="h-5 w-5" />
//               </div>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>

//             <button
//               onClick={handleLogin}
//               disabled={loading}
//               className="w-full flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg shadow-sm transition-all"
//             >
//               {loading ? (
//                 <>
//                   <FiLoader className="animate-spin h-5 w-5 mr-2" />
//                   Logging in...
//                 </>
//               ) : (
//                 <>
//                   Login
//                   <FiArrowRight className="ml-2 h-5 w-5" />
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="mt-6 text-center text-sm text-gray-600">
//             <Link href="/forgot-password" className="text-blue-500 hover:text-blue-700 hover:underline">
//               Forgot password?
//             </Link>
//             <span className="mx-2 text-gray-300">|</span>
//             <Link href="/signup" className="text-blue-500 hover:text-blue-700 hover:underline">
//               Create account
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiUser, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";
import Head from "next/head";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    if (!userId.trim()) return "User ID is required";
    if (!password.trim()) return "Password is required";
    return "";
  };

  const handleLogin = async () => {
    const validationError = validateInputs();
    if (validationError) return setError(validationError);

    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      router.push(data.role === "admin" ? "/admin-dashboard" : "/dashboard");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-[url('/signup.png')] bg-cover bg-center opacity-60"
        ></div>
      </div>

      {/* Login card wrapper */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="bg-white bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg border border-gray-100 w-full max-w-md overflow-hidden">

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sign in to your account</h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center border border-red-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg shadow-sm transition-all"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin h-5 w-5 mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
            <div className="mt-6 text-center text-sm text-white">
  <Link href="/forgot-password" className="text-white hover:text-gray-200 hover:underline">
    Forgot password?
  </Link>
  <span className="mx-2 text-white">|</span>
  <Link href="/signup" className="text-white hover:text-gray-200 hover:underline">
    Create account
  </Link>
</div>

          </div>
        </div>
      </div>
    </>
  );
}
