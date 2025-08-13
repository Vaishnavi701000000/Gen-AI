
// components/ConfigDatabaseTable.tsx

import React from "react";

interface ConfigDatabase {
  id: number;
  tenant_id: string;
  host: string;
  port: string;
  db_name: string;
  db_username: string;
  isActive: boolean;
}

interface Props {
  configDatabases: ConfigDatabase[];
  toggleIsActive: (id: number, newStatus: boolean) => void;
  deleteConfig: (id: number) => void;
}

const ConfigDatabaseTable: React.FC<Props> = ({ configDatabases, toggleIsActive, deleteConfig }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded text-sm">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-4 py-2">Tenant ID</th>
            <th className="px-4 py-2">Host</th>
            <th className="px-4 py-2">Port</th>
            <th className="px-4 py-2">Database</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {configDatabases.map((db) => (
            <tr key={db.id} className="border-t">
              <td className="px-4 py-2">{db.tenant_id}</td>
              <td className="px-4 py-2">{db.host}</td>
              <td className="px-4 py-2">{db.port}</td>
              <td className="px-4 py-2">{db.db_name}</td>
              <td className="px-4 py-2">{db.db_username}</td>
              <td className="px-4 py-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={db.isActive}
                    onChange={() => toggleIsActive(db.id, !db.isActive)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-purple-600 relative">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full" />
                  </div>
                </label>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => deleteConfig(db.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfigDatabaseTable;



// // 1/07/25
// import React from "react";

// interface ConfigDatabase {
//   id: number;
//   tenant_id: string;
//   db_username: string;
//   host: string;
//   port: string;
//   db_name: string;
//   isActive: boolean;
// }

// interface Props {
//   configDatabases: ConfigDatabase[];
//   fetchConfigDbs: () => void;
// }

// const ConfigDatabaseTable: React.FC<Props> = ({ configDatabases, fetchConfigDbs }) => {
//   return (
//     <div className="overflow-x-auto mt-4">
//       <table className="min-w-full border rounded text-sm">
//         <thead className="bg-purple-600 text-white">
//           <tr>
//             <th className="px-4 py-2">Tenant</th>
//             <th className="px-4 py-2">Host</th>
//             <th className="px-4 py-2">Port</th>
//             <th className="px-4 py-2">Database</th>
//             <th className="px-4 py-2">Username</th>
//             <th className="px-4 py-2">Status</th>
//             <th className="px-4 py-2">Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {configDatabases.map((db) => (
//             <tr key={db.id} className="border-t">
//               <td className="px-4 py-2">{db.tenant_id}</td>
//               <td className="px-4 py-2">{db.host}</td>
//               <td className="px-4 py-2">{db.port}</td>
//               <td className="px-4 py-2">{db.db_name}</td>
//               <td className="px-4 py-2">{db.db_username}</td>
//               <td className="px-4 py-2">
//                 <label className="inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={db.isActive}
//                     onChange={async () => {
//                       try {
//                         const res = await fetch("/api/toggle-status", {
//                           method: "POST",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({ id: db.id, isActive: !db.isActive }),
//                         });
//                         if (res.ok) fetchConfigDbs();
//                       } catch (err) {
//                         console.error("Toggle error", err);
//                       }
//                     }}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 relative">
//                     <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition peer-checked:translate-x-full"></div>
//                   </div>
//                 </label>
//               </td>
//               <td className="px-4 py-2">
//                 <button
//                   onClick={async () => {
//                     try {
//                       const res = await fetch(`/api/delete-config?id=${db.id}`, {
//                         method: "DELETE",
//                       });
//                       if (res.ok) fetchConfigDbs();
//                     } catch (err) {
//                       console.error("Delete error", err);
//                     }
//                   }}
//                   className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ConfigDatabaseTable;
