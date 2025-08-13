
// import React from "react";
// import Head from "next/head";
// import Prompt from "../components/Prompt";

// const Home = () => {
//   return (
//     <>
//       <Head>
//         <title>Quick Query Using Gen-AI</title>
//         <meta name="description" content="Generate SQL from Natural Language using AI" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <Prompt />
//     </>
//   );
// };

// export default Home;
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}