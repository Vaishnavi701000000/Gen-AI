

import React, { useEffect, useRef, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { FiUser, FiLogOut, FiArrowRight } from 'react-icons/fi';
import ManageDataSource from "./ManageDataSource";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Prompt = () => {
  const [humanQuery, setHumanQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'query' | 'tables' | 'manage' | 'source'>('query');
  const [userDatabases, setUserDatabases] = useState<any[]>([]);
  const [myDatabases, setMyDatabases] = useState<any[]>([]);
  const [activeDb, setActiveDb] = useState<any | null>(null);
  const [queryData, setQueryData] = useState<any[]>([]);
  const [showDatabases, setShowDatabases] = useState(false);
  const [databasesFetched, setDatabasesFetched] = useState(false);
  const [tables, setTables] = useState<{ db: string; table: string }[]>([]);
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [tablesFetched, setTablesFetched] = useState(false);

 const [showForm, setShowForm] = useState(false);
  const [dbNameInput, setDbNameInput] = useState("");
  
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Runs only in the browser
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "info" | "warning" | "error",
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message: string, severity: "success" | "info" | "warning" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleShowTables = async () => {
    try {
      const res = await fetch("/api/tables");
      const data = await res.json();
      setDbTables(data.tables || []);
      setTablesFetched(true);
    } catch (error) {
      console.error("Error fetching tables", error);
      setDbTables([]);
      setTablesFetched(true);
      showNotification("Error fetching tables", "error");
    }
  };

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/login";
    }
  }, []);

  // useEffect(() => {
  //   async function fetchTables() {
  //     try {
  //       const res = await fetch("/api/tables");
  //       const data = await res.json();
  //       setTables(data.tables || []);
  //     } catch (error) {
  //       console.error("Error fetching tables", error);
  //       showNotification("Error fetching tables", "error");
  //     }
  //   }
  //   fetchTables();
  // }, []);

  useEffect(() => {
  async function fetchTables() {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showNotification("No userId found in local storage", "error");
        return;
      }
      const res = await fetch(`/api/tables?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      setTables(data.tables || []);
    } catch (error) {
      console.error("Error fetching tables", error);
      showNotification("Error fetching tables", "error");
    }
  }
  fetchTables();
}, []);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTranslate = async () => {
    if (!humanQuery.trim()) {
      showNotification("Please enter a query to translate", "warning");
      return;
    }
    
    setIsLoading(true);
    setSqlQuery("Generating SQL query...");
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: humanQuery }),
      });
      const res = await response.json();
      const cleanedSql = (res.sql || "")
        .replace(/```sql|```/gi, "")
        .trim();
      setSqlQuery(cleanedSql || "Failed to generate SQL");
      if (!cleanedSql) {
        showNotification("Failed to generate SQL", "error");
      }
    } catch (error) {
      setSqlQuery("Error generating SQL");
      showNotification("Error generating SQL", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetData = async () => {
    if (!sqlQuery.trim()) {
      showNotification("Please generate a SQL query first", "warning");
      return;
    }
  
    setIsLoading(true);
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showNotification("No userId found, please log in again", "error");
      setIsLoading(false);
      return;
    }
  
    if (!activeDb) {
      showNotification("Please activate a database before fetching data.", "warning");
      setIsLoading(false);
      return;
    }
  
    try {
      const cleanSQL = sqlQuery.replace(/```sql|```/g, "").split("\n\nResult:")[0].trim();
  
      const response = await fetch("/api/query/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: cleanSQL,
          userId: userId,
        }),
      });
  
      const res = await response.json();
  
      // ✅ Check for error or message returned from backend
      const errorMsg = (res.error || res.message || "").toLowerCase();
  
      if (res.error || res.message) {
        if (errorMsg.includes("doesn't exist") && errorMsg.includes("table")) {
          showNotification("Table not found. Please check the table name and make sure it's correct.", "error");
        } else if (errorMsg.includes("no active database")) {
          showNotification("No active database found. Please activate a database first.", "error");
        } else {
          showNotification(res.error || res.message, "error");
        }
  
        setQueryData([{ error: res.error || res.message }]);
      } else {
        setQueryData(res.results || []);
      }
  
    } catch (error) {
      console.error(error);
      setQueryData([{ error: "Failed to execute query" }]);
      showNotification("Failed to execute query", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
//   const handleCreateNewDb = async () => {
//   const userId = localStorage.getItem('userId');
//   if (!userId) {
//     showNotification('No userId found in local storage', 'error');
//     return;
//   }

//   // Collect these details via a form or prompt!
//   const dbDetails = {
//     db_name: 'my_database',
//   };

//   try {
//     const res = await fetch('/api/manage/create-db', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, ...dbDetails }),
//     });
//     const data = await res.json();
//     if (res.ok) {
//       showNotification(data.message, 'success');
//       handleShowMyDbs(); // Refresh DB list!
//     } else {
//       showNotification(data.message, 'error');
//     }
//   } catch (err) {
//     showNotification("Failed to create database", "error");
//   }
// }





  
  const handleShowMyDbs = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showNotification("No userId found in local storage", "error");
        return;
      }
      const res = await fetch(`/api/manage/show-dbs?userId=${userId}`);
      const data = await res.json();
      setMyDatabases(data.databases || []);
      setDatabasesFetched(true);
      if (!data.databases || data.databases.length === 0) {
        showNotification("No databases found for this user", "info");
      }
    } catch (error) {
      console.error("Error fetching databases", error);
      setDatabasesFetched(true);
      showNotification("Error fetching databases", "error");
    }
  };

    const handleCreateNewDb = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showNotification("No userId found in local storage", "error");
      return;
    }
    if (!dbNameInput.trim()) {
      showNotification("Please enter a database name", "error");
      return;
    }

    try {
      const res = await fetch("/api/manage/create-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, db_name: dbNameInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message, "success");
        setShowForm(false);
        setDbNameInput("");
        handleShowMyDbs(); // Refresh DB list after creation
      } else {
        showNotification(data.message, "error");
      }
    } catch {
      showNotification("Failed to create database", "error");
    }
    }

  const handleToggleDb = async (index: number) => {
    const updated = myDatabases.map((db, i) => ({
      ...db,
      isActive: i === index,
    }));
    setMyDatabases(updated);
    setActiveDb(updated[index]);
  
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        await fetch("/api/manage/update-dbs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            managed_dbs: updated,
          }),
        });
        showNotification(`Database ${updated[index].db_name} is now active`, "success");
      } catch (error) {
        console.error("Error updating database status", error);
        showNotification("Error updating database status", "error");
      }
    }
  };
  
  // const handleTableClick = async (tableName: string, dbName: string) => {
  //   setSelectedTable(tableName);
  //   setIsLoading(true);
  //   try {
  //     const res = await fetch(`/api/table-data?table=${tableName}&db=${dbName}`);
  //     const data = await res.json();
  //     setTableData(data.rows || []);
  //     if (!data.rows || data.rows.length === 0) {
  //       showNotification(`No data found in table ${tableName}`, "info");
  //     }
  //   } catch (error) {
  //     setTableData([{ error: "Failed to load table data" }]);
  //     showNotification("Failed to load table data", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleTableClick = async (tableName: string, dbName: string) => {
  setSelectedTable(tableName);
  setIsLoading(true);

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showNotification("No userId found in local storage", "error");
      setIsLoading(false);
      return;
    }

    const res = await fetch(
      `/api/table-data?table=${encodeURIComponent(tableName)}&db=${encodeURIComponent(dbName)}&userId=${encodeURIComponent(userId)}`
    );
    const data = await res.json();

    setTableData(data.rows || []);

    if (!data.rows || data.rows.length === 0) {
      showNotification(`No data found in table ${tableName}`, "info");
    }
  } catch (error) {
    setTableData([{ error: "Failed to load table data" }]);
    showNotification("Failed to load table data", "error");
  } finally {
    setIsLoading(false);
  }
};


  const handleClear = () => {
    setHumanQuery("");
    setSqlQuery("");
    setTableData([]);
    setSelectedTable(null);
    setCopied(false);
    setQueryData([]);
    showNotification("Cleared all inputs and results", "info");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);
      showNotification("SQL query copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showNotification("Failed to copy SQL query", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
         sx={{ mt: 6 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Sidebar - Kept exactly as original */}
      <aside className="w-64 h-full bg-gradient-to-b from-purple-900 to-purple-800 text-white fixed top-0 left-0 px-6 py-8 shadow-xl">
        <div className="flex items-center mb-8">
          <div className="bg-white rounded-lg p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Quick Query</h2>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('query')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === 'query' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Query Generator
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === 'tables' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Database Tables
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === 'manage' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
     className="h-5 w-5 mr-3" 
     fill="none" 
     viewBox="0 0 24 24" 
     stroke="currentColor" 
     strokeWidth={2}>
  {/* Database shape */}
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6c0-1.105 3.582-2 8-2s8 .895 8 2-3.582 2-8 2-8-.895-8-2z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6v4.5c0 1.105 3.582 2 8 2s8-.895 8-2V6" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5V15c0 1.105 3.582 2 8 2 .702 0 1.376-.032 2.016-.093" />
  
  {/* Gear shape */}
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a1.65 1.65 0 010 2.34l-.06.06a1.65 1.65 0 01-1.82.33 1.65 1.65 0 00-1.56 0 1.65 1.65 0 01-1.82-.33l-.06-.06a1.65 1.65 0 010-2.34l.06-.06A1.65 1.65 0 0014.6 15a1.65 1.65 0 00-.33-1.82l-.06-.06a1.65 1.65 0 010-2.34l.06-.06a1.65 1.65 0 011.82-.33 1.65 1.65 0 001.56 0 1.65 1.65 0 011.82.33l.06.06a1.65 1.65 0 010 2.34l-.06.06A1.65 1.65 0 0019.4 15z" />
</svg>

            Manage Database
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === 'source' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-700/50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
     className="h-5 w-5 mr-3" 
     fill="none" 
     viewBox="0 0 24 24" 
     stroke="currentColor" 
     strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6c0-1.105 3.582-2 8-2s8 .895 8 2-3.582 2-8 2-8-.895-8-2z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6v6c0 1.105 3.582 2 8 2s8-.895 8-2V6" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v6c0 1.105 3.582 2 8 2s8-.895 8-2v-6" />
</svg>

            Manage DataSource
          </button>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-xs text-purple-200 opacity-70">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </aside>

      {/* Main Content - Updated as requested */}
      <main className="ml-64 flex flex-col px-8 pt-2 pb-6 w-full">
        {/* Header - Centered title and user dropdown */}
        <div className="w-full max-w-6xl relative flex justify-center items-center mb-6">
  <h1 className="text-3xl font-bold text-purple-800 text-center w-full">
    Quick Query Using Gen-AI
  </h1>

  {/* User icon and dropdown at top-right */}
  {/* User icon and dropdown at top-right */}
<div className="absolute right-0" ref={userDropdownRef}>
  <button
    onClick={() => setShowUserDropdown(!showUserDropdown)}
    className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all"
  >
    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
      <FiUser className="h-5 w-5" />
    </div>
    <span className="hidden sm:block font-medium">
      {userId || "User"}

    </span>
  </button>

  {showUserDropdown && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
      <div className="px-4 py-2 text-sm text-gray-700 border-b">
        <div className="font-semibold">
          {localStorage.getItem("userId") || "User"}
        </div>
        <div className="text-xs text-gray-500 truncate">
          Logged in user
        </div>
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <FiLogOut className="mr-2" />
        Logout
      </button>
    </div>
  )}
</div>
</div>
        {/* Query Section */}
        {activeTab === 'query' && (
          <div className="w-full max-w-6xl space-y-6">
            {/* Textarea for Natural Language Input */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={humanQuery}
                onChange={(e) => setHumanQuery(e.target.value)}
                placeholder="Type your natural language query here (e.g. 'list of customers name')..."
                className="w-full h-40 p-5 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-sm transition-all resize-none"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleTranslate()}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {humanQuery.length}/500
              </div>
            </div>

            {/* Buttons in single row */}
            <div className="flex gap-4 w-full">
              <button
                onClick={handleTranslate}
                disabled={!humanQuery.trim() || isLoading}
                className={`flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-xl shadow-md transition-all ${(!humanQuery.trim() || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Translate to SQL
                  </>
                )}
              </button>
              
              <button
                onClick={handleGetData}
                disabled={!sqlQuery.trim() || isLoading}
                className={`flex-1 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 px-6 rounded-xl shadow-md transition-all ${(!sqlQuery.trim() || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Get Data
              </button>
              
              <button
              onClick={handleClear}
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl shadow-md transition-all"
              >
              Clear
              <FiArrowRight className="h-4 w-4 ml-2" />
             </button>
            </div>
          </div>
        )}

        {/* Rest of the components remain exactly the same */}
        {/* Tables Section */}
        {activeTab === 'tables' && (
  <div className="w-full max-w-6xl">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Database Tables</h2>

    <div className="flex items-center gap-4 mb-4">
      <button
        onClick={async () => {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            showNotification("No userId found in local storage", "error");
            return;
          }

          try {
            const res = await fetch(`/api/tables?userId=${userId}`);
            const data = await res.json();
            if (data.tables) {
              setTables(data.tables);
            } else {
              setTables([]);
            }
          } catch (error) {
            console.error("Error fetching tables:", error);
            setTables([]);
            showNotification("Error fetching tables", "error");
          }
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
      >
        Show Tables
      </button>

      {/* ✅ Red Clear Button */}
      <button
        onClick={() => {
          setTables([]);
          setTableData([]);
          setSelectedTable(null);
          showNotification("Cleared table list and data", "info");
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
      >
        Clear
      </button>
    </div>


            {tables.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {tables.map((entry, index) => (
                  <li
                    key={`${entry.db}_${entry.table}_${index}`}
                    onClick={() => handleTableClick(entry.table, entry.db)}
                    className="cursor-pointer bg-white border p-3 rounded shadow text-gray-800 hover:bg-purple-50 transition"
                  >
                    {entry.db} &gt; <strong>{entry.table}</strong>
                  </li>
                ))}
              </ul>
            ) : tablesFetched ? (
              <p className="mt-4 text-gray-600">No tables found.</p>
            ) : null}

            {tableData.length > 0 && selectedTable && (
              <div className="w-full mt-6 overflow-auto shadow-lg rounded-xl border border-gray-200 bg-white">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">
                    Data from <strong>{selectedTable}</strong>
                  </h3>
                  <span className="text-sm text-gray-500">
                    {tableData.length} {tableData.length === 1 ? "row" : "rows"}
                  </span>
                </div>
                <table className="w-full border-collapse">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th key={key} className="px-6 py-3 text-left font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        {Object.values(row).map((val, i) => (
                          <td
                            key={i}
                            className="px-6 py-3 border-t border-gray-200 text-gray-700"
                          >
                            <div className="max-w-xs truncate" title={String(val)}>
                              {String(val)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Manage Database Section */}
        {activeTab === "manage" && (
          <div className="w-full max-w-6xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Databases</h2>
            <button
              onClick={handleShowMyDbs}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
            >
              Show My Databases
            </button>
           
                 {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white mx-5 px-4 py-2 rounded shadow"
        >
          Create new Database
        </button>
      )}

      {showForm && (
        <div className="flex items-center space-x-2 mt-4">
          <input
            type="text"
            placeholder="Enter database name"
            value={dbNameInput}
            onChange={(e) => setDbNameInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 bg-purple-50"
          />
          <button
            onClick={handleCreateNewDb}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setDbNameInput("");
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
      
            {databasesFetched ? (
              myDatabases.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {myDatabases.map((db, index) => (
                    <li
                      key={db.db_name}
                      className="bg-white border p-3 rounded shadow text-gray-800 flex justify-between items-center"
                    >
                      <span>{db.db_name}</span>
                      <label className="flex items-center space-x-2">
                        <span className="text-sm">Active</span>
                        <input
                          type="checkbox"
                          checked={db.isActive}
                          onChange={() => handleToggleDb(index)}
                          className="accent-purple-600"
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-gray-600">No databases found.</p>
              )
            ) : null}
          </div>
        )}

 {activeTab === "source" && userId && (
  <div>
    <ManageDataSource userId={userId} />
  </div>
)}
        

        {/* SQL Output Box */}
        {sqlQuery && activeTab === 'query' && (
          <div className="w-full max-w-6xl relative">
            <div className="p-5 bg-white border-l-4 border-purple-500 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-purple-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Generated SQL
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy SQL
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap">{sqlQuery}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Data Grid */}
        {queryData.length > 0 && activeTab === 'query' && (
          <div className="w-full max-w-6xl overflow-auto shadow-lg rounded-xl border border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium text-gray-700">
                Query Results
              </h3>
              <span className="text-sm text-gray-500">
                {queryData.length} {queryData.length === 1 ? 'row' : 'rows'}
              </span>
            </div>
            <table className="w-full border-collapse">
              <thead className="bg-purple-600 text-white">
                <tr>
                  {Object.keys(queryData[0]).map((key) => (
                    <th key={key} className="px-6 py-3 text-left font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryData.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-6 py-3 border-t border-gray-200 text-gray-700">
                        <div className="max-w-xs truncate" title={String(val)}>
                          {String(val)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl flex items-center">
              <svg className="animate-spin h-8 w-8 text-purple-600 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Processing your request...</span>
            </div>
          </div>
        )}
      </main>
    </div>

  );
};

export default Prompt;