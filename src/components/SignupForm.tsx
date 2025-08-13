
// // src/components/SignupForm.tsx
// import { useState } from "react";
// import { useRouter } from "next/router";

// export default function SignupForm() {
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSignup = async () => {
//     if (!userId || !password) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, password, role }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert(data.message || "Signup successful! Please login.");
//         router.push("/login"); // redirect to login page
//       } else {
//         setError(data.message || "Signup failed");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       setError("Something went wrong, please try again");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow-md w-96">
//       <h2 className="text-2xl font-bold mb-4">Signup</h2>
//       {error && <p className="text-red-500 mb-2">{error}</p>}
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
//       {/* <select
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//         className="w-full mb-3 p-2 border rounded"
//       >
//         <option value="user">User</option>
//         <option value="admin">Admin</option>
//       </select> */}
//       <button
//         onClick={handleSignup}
//         className="bg-purple-600 text-white w-full py-2 rounded"
//       >
//         Sign Up
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { useRouter } from "next/router";
import { FiUser, FiLock, FiArrowRight, FiChevronDown } from "react-icons/fi";
import Head from "next/head";

export default function SignupForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!userId || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Signup successful! Please login.");
        router.push("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - AI Platform</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full bg-[url('/loginimg.png')] bg-cover bg-center opacity-60"
        ></div>
      </div>

        {/* Form container */}
        <div className="relative z-10 bg-white bg-opacity-50 rounded-xl shadow-lg border border-white border-opacity-20 w-full max-w-md p-8 backdrop-blur-sm">
          {/* Compact Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-1">Join our AI platform today</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center border border-red-100">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
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

            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <FiChevronDown className="h-5 w-5" />
              </div>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-4 rounded-lg shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Login here
            </a>
          </div>
        </div>
      </div>
    </>
  );
}