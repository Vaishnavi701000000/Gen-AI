import Image from "next/image";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState("2023");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  // return (
  //   <footer className="flex flex-col md:flex-row items-center justify-start w-full h-36 md:h-[100px] bg-black text-white fixed bottom-0">
     
  //     {/* Logo */}
  //     <div className="flex flex-row items-center justify-center w-full h-24 mt-5 md:mt-0">
  //       <Image src="/rain.jpeg" alt="Animesh Sharma" width="40" height="40" />
  //     </div>
  //     {/* Copyright */}
  //     <div className="flex flex-row items-center justify-center w-full h-24">
  //       <p className="text-md">
  //         © {currentYear}  All rights reserved.
  //       </p>
  //     </div>
  //     {/* Social Media */}
  //     <div className="flex flex-row items-center justify-center w-full h-24 space-x-1">
  //       <SocialIcon
  //         url="https://www.linkedin.com/in/animesharma3/"
  //         bgColor="#000000"
  //         fgColor="#ffffff"
  //         style={{ height: 40, width: 40 }}
  //       />
  //       <SocialIcon
  //         url="https://www.github.com/animesharma3/"
  //         bgColor="#000000"
  //         fgColor="#ffffff"
  //         style={{ height: 40, width: 40 }}
  //       />
  //       <SocialIcon
  //         url="https://www.youtube.com/@animesharma3"
  //         bgColor="#000000"
  //         fgColor="#ffffff"
  //         style={{ height: 40, width: 40 }}
  //       />
  //       <SocialIcon
  //         url="https://www.instagram.com/animesharma3"
  //         bgColor="#000000"
  //         fgColor="#ffffff"
  //         style={{ height: 40, width: 40 }}
  //       />
  //       <SocialIcon
  //         url="https://www.twitter.com/animesharma3"
  //         bgColor="#000000"
  //         fgColor="#ffffff"
  //         style={{ height: 40, width: 40 }}
  //       />
  //     </div>
  //   </footer>
  // );
};

export default Footer;





// import React, { useEffect, useRef, useState } from "react";

// const Prompt = () => {
//   const [humanQuery, setHumanQuery] = useState("");
//   const [sqlQuery, setSqlQuery] = useState("");
//   const [tables, setTables] = useState<string[]>([]);
//   const [selectedTable, setSelectedTable] = useState<string | null>(null);
//   const [tableData, setTableData] = useState<any[]>([]);
//   const [copied, setCopied] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState<'query' | 'tables' | 'manage'>('query');
//   const [userDatabases, setUserDatabases] = useState<any[]>([]);
//   const [myDatabases, setMyDatabases] = useState<any[]>([]);
//   const [activeDb, setActiveDb] = useState<any | null>(null);
//   const [queryData, setQueryData] = useState<any[]>([]);
//   const [showDatabases, setShowDatabases] = useState(false);



//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     if (textareaRef.current) textareaRef.current.focus();
//   }, []);

//   useEffect(() => {
//     async function fetchTables() {
//       const res = await fetch("/api/tables");
//       const data = await res.json();
//       setTables(data.tables || []);
//     }
//     fetchTables();
//   }, []);

//   const handleTranslate = async () => {
//     if (!humanQuery.trim()) return;
    
//     setIsLoading(true);
//     setSqlQuery("Generating SQL query...");
//     try {
//       const response = await fetch("/api/query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: humanQuery }),
//       });
//       const res = await response.json();
//       // setSqlQuery(res.sql || "Failed to generate SQL");
//       const cleanedSql = (res.sql || "")
//   .replace(/```sql|```/gi, "")  // remove code fences
//   .trim();
//    setSqlQuery(cleanedSql || "Failed to generate SQL");

//     } catch (error) {
//       setSqlQuery("Error generating SQL");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGetData = async () => {
//     if (!sqlQuery.trim()) return;
  
//     setIsLoading(true);
  
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("No userId found, please log in again.");
//       setIsLoading(false);
//       return;
//     }
  
//     if (!activeDb) {
//       alert("Please activate a database before fetching data.");
//       setIsLoading(false);
//       return;
//     }
  
//     try {
//       const cleanSQL = sqlQuery.replace(/```sql|```/g, "").split("\n\nResult:")[0].trim();
  
//       const response = await fetch("/api/query/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sql: cleanSQL,       // your generated SQL text
//           userId: userId       // assuming you have userId defined above
//         }),
//       });
      
  
//       const res = await response.json();
  
//       if (res.error) {
//         setQueryData([{ error: res.error }]);
//       } else {
//         setQueryData(res.results || []);
//       }
//     } catch (error) {
//       console.error(error);
//       setTableData([{ error: "Failed to execute query" }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleShowMyDbs = async () => {
//     try {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         alert("No userId found in local storage");
//         return;
//       }
//       const res = await fetch(`/api/manage/show-dbs?userId=${userId}`);
//       const data = await res.json();
//       setMyDatabases(data.databases || []);
//        setShowDatabases(true);
//     } catch (error) {
//       console.error("Error fetching databases", error);
//     }
//   };

//   const handleToggleDb = async (index: number) => {
//     const updated = myDatabases.map((db, i) => ({
//       ...db,
//       isActive: i === index,
//     }));
//     setMyDatabases(updated);
//     setActiveDb(updated[index]);
  
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       await fetch("/api/manage/update-dbs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           managed_dbs: updated,
//         }),
//       });
//     }
  
//     alert(`Database ${updated[index].db_name} is now active`);
//   };
  
//   const handleTableClick = async (tableName: string) => {
//     setSelectedTable(tableName);
//     setIsLoading(true);
//     try {
//       const res = await fetch(`/api/table-data?table=${tableName}`);
//       const data = await res.json();
//       setTableData(data.rows || []);
//     } catch (error) {
//       setTableData([{ error: "Failed to load table data" }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setHumanQuery("");
//     setSqlQuery("");
//     setTableData([]);
//     setSelectedTable(null);
//     setCopied(false);
//   };

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(sqlQuery);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
//       {/* Sidebar */}
//       <aside className="w-64 h-full bg-gradient-to-b from-purple-900 to-purple-800 text-white fixed top-0 left-0 px-6 py-8 shadow-xl">
//         <div className="flex items-center mb-8">
//           <div className="bg-white rounded-lg p-2 mr-3">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold">Quick Query</h2>
//         </div>
//         <nav className="space-y-4">
//           <button
//             onClick={() => setActiveTab('query')}
//             className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
//               activeTab === 'query' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
//             }`}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             Query Generator
//           </button>

//           <button
//             onClick={() => setActiveTab('tables')}
//             className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
//               activeTab === 'tables' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
//             }`}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             Database Tables
//           </button>

//           <button
//             onClick={() => setActiveTab('manage')}
//             className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
//               activeTab === 'manage' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
//             }`}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             Manage Database
//           </button>
//         </nav>
//         <div className="absolute bottom-6 left-6 right-6">
//           <div className="text-xs text-purple-200 opacity-70">
//             © {new Date().getFullYear()} All rights reserved.
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-64 flex flex-col items-center gap-6 px-8 py-12 w-full">
//         {/* Header */}
//         <div className="w-full max-w-6xl flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-purple-800 flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             Quick Query Using Gen-AI
//           </h1>
//           <button
//             onClick={handleClear}
//             className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//             Clear
//           </button>
//         </div>

//         {/* Query Section */}
//         {activeTab === 'query' && (
//           <div className="w-full max-w-6xl space-y-6">
//             {/* Textarea for Natural Language Input */}
//             <div className="relative">
//               <textarea
//                 ref={textareaRef}
//                 value={humanQuery}
//                 onChange={(e) => setHumanQuery(e.target.value)}
//                 placeholder="Type your natural language query here (e.g. 'list of customers name')..."
//                 className="w-full h-40 p-5 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-sm transition-all resize-none"
//                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleTranslate()}
//               />
//               <div className="absolute bottom-4 right-4 text-sm text-gray-400">
//                 {humanQuery.length}/500
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4 w-full justify-center">
//               <button
//                 onClick={handleTranslate}
//                 disabled={!humanQuery.trim() || isLoading}
//                 className={`flex items-center justify-center flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-xl shadow-md transition-all ${(!humanQuery.trim() || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
//                     </svg>
//                     Translate to SQL
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleGetData}
//                 disabled={!sqlQuery.trim() || isLoading}
//                 className={`flex items-center justify-center flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 px-6 rounded-xl shadow-md transition-all ${(!sqlQuery.trim() || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
//                 </svg>
//                 Get Data
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Tables Section */}
//        {/* TABLES SECTION - shows rows only in tables tab */}
// {tableData.length > 0 && activeTab === 'tables' && (
//   <div className="w-full max-w-6xl overflow-auto shadow-lg rounded-xl border border-gray-200 bg-white mt-4">
//     <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
//       <h3 className="font-medium text-gray-700">
//         {selectedTable ? `Data from ${selectedTable}` : "Table Data"}
//       </h3>
//       <span className="text-sm text-gray-500">
//         {tableData.length} {tableData.length === 1 ? 'row' : 'rows'}
//       </span>
//     </div>
//     <table className="w-full border-collapse">
//       <thead className="bg-purple-600 text-white">
//         <tr>
//           {Object.keys(tableData[0]).map((key) => (
//             <th key={key} className="px-6 py-3 text-left font-medium">{key}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {tableData.map((row, index) => (
//           <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//             {Object.values(row).map((val, i) => (
//               <td key={i} className="px-6 py-3 border-t border-gray-200 text-gray-700">
//                 <div className="max-w-xs truncate" title={String(val)}>
//                   {String(val)}
//                 </div>
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}
//         {/* Manage Database Section */}
//         {activeTab === "manage" && (
//           <div className="w-full max-w-6xl">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Databases</h2>
//             <button
//               onClick={handleShowMyDbs}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
//             >
//               Show My Databases
//             </button>
//             {myDatabases.length > 0 ? (
//               <ul className="mt-4 space-y-2">
//                 {myDatabases.map((db, index) => (
//                   <li
//                     key={db.db_name}
//                     className="bg-white border p-3 rounded shadow text-gray-800 flex justify-between items-center"
//                   >
//                     <span>{db.db_name}</span>
//                     <label className="flex items-center space-x-2">
//                       <span className="text-sm">Active</span>
//                       <input
//                         type="checkbox"
//                         checked={db.isActive}
//                         onChange={() => handleToggleDb(index)}
//                         className="accent-purple-600"
//                       />
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="mt-4 text-gray-600">No databases found.</p>
//             )}
//           </div>
//         )}

//         {/* SQL Output Box */}
//         {sqlQuery && activeTab === 'query' && (
//           <div className="w-full max-w-6xl relative">
//             <div className="p-5 bg-white border-l-4 border-purple-500 rounded-xl shadow-md">
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="font-semibold text-purple-700 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Generated SQL
//                 </h2>
//                 <button
//                   onClick={handleCopy}
//                   className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
//                 >
//                   {copied ? (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       Copied!
//                     </>
//                   ) : (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                       </svg>
//                       Copy SQL
//                     </>
//                   )}
//                 </button>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
//                 <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap">{sqlQuery}</pre>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Data Grid */}
//         {/* QUERY RESULTS SECTION (Query Generator tab) */}
// {queryData.length > 0 && activeTab === 'query' && (
//   <div className="w-full max-w-6xl overflow-auto shadow-lg rounded-xl border border-gray-200 bg-white">
//     <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
//       <h3 className="font-medium text-gray-700">
//         Query Results
//       </h3>
//       <span className="text-sm text-gray-500">
//         {queryData.length} {queryData.length === 1 ? 'row' : 'rows'}
//       </span>
//     </div>
//     <table className="w-full border-collapse">
//       <thead className="bg-purple-600 text-white">
//         <tr>
//           {Object.keys(queryData[0]).map((key) => (
//             <th key={key} className="px-6 py-3 text-left font-medium">
//               {key}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {queryData.map((row, index) => (
//           <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//             {Object.values(row).map((val, i) => (
//               <td key={i} className="px-6 py-3 border-t border-gray-200 text-gray-700">
//                 <div className="max-w-xs truncate" title={String(val)}>
//                   {String(val)}
//                 </div>
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}
//         {/* Loading State */}
//         {isLoading && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl flex items-center">
//               <svg className="animate-spin h-8 w-8 text-purple-600 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span className="text-lg font-medium">Processing your request...</span>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Prompt;