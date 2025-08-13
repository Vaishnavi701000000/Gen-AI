// // pages/admin-dashboard.tsx
// import React from "react";

// const AdminDashboard = () => {
//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1>
//       <p className="text-gray-600 mt-4">Welcome, Admin. Here you can manage tenants and databases.</p>
//     </div>
//   );
// };

// export default AdminDashboard;
// pages/admin.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Tenant {
  id: number;
  name: string;
  db_host: string;
  db_user: string;
  db_password: string;
  db_name: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/tenants');
      const data = await res.json();
      if (res.ok) {
        setTenants(data.tenants);
      } else {
        setError(data.message || 'Failed to fetch tenants');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Admin Dashboard</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {isLoading ? (
        <div>Loading tenants...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Host</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">DB Name</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-t">
                  <td className="px-4 py-2">{tenant.id}</td>
                  <td className="px-4 py-2">{tenant.name}</td>
                  <td className="px-4 py-2">{tenant.db_host}</td>
                  <td className="px-4 py-2">{tenant.db_user}</td>
                  <td className="px-4 py-2">{tenant.db_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
