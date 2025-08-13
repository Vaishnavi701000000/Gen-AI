

// import React, { useEffect } from "react";
// import Head from "next/head";
// import Prompt from "../components/Prompt";
// import { useRouter } from "next/router";

// const Dashboard = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/");
//     }
//   }, []);

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

// export default Dashboard;

import React, { useEffect } from "react";
import Head from "next/head";
import Prompt from "../components/Prompt";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Quick Query Using Gen-AI</title>
        <meta name="description" content="Generate SQL from Natural Language using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Prompt />
    </>
  );
};

export default Dashboard;