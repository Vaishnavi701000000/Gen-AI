import React, { useEffect, useState } from "react";
import axios from "axios";

type ManagedDb = {
  id: string;
  label: string;
  host: string;
  port: number;
  db_name?: string | null;
  db_username: string;
  db_password?: string | null;
  isActive?: boolean;
};

interface Props {
  userId: string;
}

export default function ManageDataSource({ userId }: Props) {
  const [connections, setConnections] = useState<ManagedDb[]>([]);
  const [form, setForm] = useState({
    host: "",
    port: 3306,
    db_username: "",
    db_password: "",
    db_name: "",
    label: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      const { data } = await axios.get(`/api/manage/show-dbs?userId=${userId}`);
      setConnections(data.databases || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) fetchConnections();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddConnection = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await axios.post("/api/manage/add-connection", {
        userId,
        host: form.host,
        port: Number(form.port),
        db_username: form.db_username,
        db_password: form.db_password,
        db_name: form.db_name || null,
        label: form.label || form.host,
        testConnection: true,
      });
      setMessage("Connection added successfully");
      setForm({
        host: "",
        port: 3306,
        db_username: "",
        db_password: "",
        db_name: "",
        label: "",
      });
      fetchConnections();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to add connection");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await axios.post("/api/manage/activate-db", { userId, connectionId: id });
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/manage/delete-connection", {
        data: { userId, connectionId: id },
      });
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Manage Data Sources</h1>

      {message && <div className="p-2 bg-gray-200">{message}</div>}

      {/* Add form */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold">Add New Connection</h2>
        <input name="label" placeholder="Label" value={form.label} onChange={handleChange} className="border p-1 w-full bg-purple-50" />
        <input name="host" placeholder="Host" value={form.host} onChange={handleChange} className="border p-1 w-full bg-purple-50" />
        <input name="port" placeholder="Port" value={form.port} onChange={handleChange} className="border p-1 w-full bg-purple-50" type="number" />
        <input name="db_username" placeholder="DB Username" value={form.db_username} onChange={handleChange} className="border p-1 w-full bg-purple-50" />
        <input name="db_password" placeholder="DB Password" type="password" value={form.db_password} onChange={handleChange} className="border p-1 w-full bg-purple-50" />
        <input name="db_name" placeholder="(Optional) Default DB name" value={form.db_name} onChange={handleChange} className="border p-1 w-full bg-purple-50" />
        <button
          disabled={loading}
          onClick={handleAddConnection}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          {loading ? "Adding..." : "Add Connection"}
        </button>
      </div>

      {/* List */}
      <div>
        <h2 className="font-semibold">Existing Connections</h2>
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Label</th>
              <th className="p-2 border">Host</th>
              <th className="p-2 border">Port</th>
              <th className="p-2 border">Active</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((conn) => (
              <tr key={conn.id} className={conn.isActive ? "bg-green-50" : ""}>
                <td className="border p-2">{conn.label}</td>
                <td className="border p-2">{conn.host}</td>
                <td className="border p-2">{conn.port}</td>
                <td className="border p-2">{conn.isActive ? "Yes" : "No"}</td>
                <td className="border p-2 space-x-2">
                  {!conn.isActive && (
                    <button
                      onClick={() => handleActivate(conn.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(conn.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {connections.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No connections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
