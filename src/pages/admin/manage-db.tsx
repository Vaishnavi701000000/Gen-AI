// // pages/admin/manage-db.tsx
// import React, { useEffect, useState } from "react";

// interface Tenant {
//   id: number;
//   name: string;
//   host: string;
//   user: string;
//   password: string;
//   database: string;
// }

// const ManageDatabasePage = () => {
//   const [tenants, setTenants] = useState<Tenant[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [form, setForm] = useState<Partial<Tenant>>({});

//   const fetchTenants = async () => {
//     setIsLoading(true);
//     const res = await fetch("/api/tenants");
//     const data = await res.json();
//     setTenants(data.tenants);
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     if (role !== "admin") {
//       alert("Access Denied: Only admins can view this page");
//       window.location.href = "/";
//     } else {
//       fetchTenants();
//     }
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleAddOrUpdate = async () => {
//     const method = form.id ? "PUT" : "POST";
//     const endpoint = form.id ? `/api/tenants/${form.id}` : "/api/tenants";
//     await fetch(endpoint, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     setForm({});
//     fetchTenants();
//   };

//   const handleEdit = (tenant: Tenant) => {
//     setForm(tenant);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Are you sure you want to delete this tenant?")) {
//       await fetch(`/api/tenants/${id}`, { method: "DELETE" });
//       fetchTenants();
//     }
//   };

//   return (
//     <div className="p-10 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold text-purple-700 mb-6">Manage Tenants</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//         {[
//           "name",
//           "host",
//           "user",
//           "password",
//           "database",
//         ].map((field) => (
//           <input
//             key={field}
//             type="text"
//             name={field}
//             value={(form as any)[field] || ""}
//             onChange={handleInputChange}
//             placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//             className="border border-gray-300 p-2 rounded-lg"
//           />
//         ))}
//         <button
//           onClick={handleAddOrUpdate}
//           className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-2"
//         >
//           {form.id ? "Update Tenant" : "Add Tenant"}
//         </button>
//       </div>

//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="w-full border border-gray-200">
//           <thead className="bg-purple-600 text-white">
//             <tr>
//               <th className="px-4 py-2">ID</th>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Host</th>
//               <th className="px-4 py-2">User</th>
//               <th className="px-4 py-2">Database</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tenants.map((tenant) => (
//               <tr key={tenant.id} className="text-center border-t">
//                 <td className="px-4 py-2">{tenant.id}</td>
//                 <td className="px-4 py-2">{tenant.name}</td>
//                 <td className="px-4 py-2">{tenant.host}</td>
//                 <td className="px-4 py-2">{tenant.user}</td>
//                 <td className="px-4 py-2">{tenant.database}</td>
//                 <td className="px-4 py-2 space-x-2">
//                   <button
//                     onClick={() => handleEdit(tenant)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(tenant.id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ManageDatabasePage;
