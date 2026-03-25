"use client";

import React, { useEffect, useState } from 'react';

// Change from: export default function UsersPage({ onNavigate }) {
export default function UsersPage(props) {
  const { onNavigate } = props;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to delete");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p className="text-white p-8">Loading users...</p>;

  return (
    <div className="relative min-h-screen bg-black/50">
      <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20"></div>
      
      <main className="relative z-10 p-8">
        <header className="mb-10">
          <h1 className="text-[20px] font-bold uppercase text-white">All Users</h1>
          <p className="text-[#9A9A9A] text-sm mt-1">Directory of all participants and their teams</p>
        </header>

        <div className="w-full bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#9A9A9A] text-white font-bold">
                <th className="p-4 pl-6">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Reg No.</th>
                <th className="p-4">Team Name</th>
                <th className="p-4">Team Code</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user, index) => (
                <tr key={user.id || index} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 text-white/70">{index + 1}</td>
                  <td className="p-4 text-white font-medium">{user.name || "N/A"}</td>
                  <td className="p-4 text-white/80">{user.regNo || "N/A"}</td>
                  <td 
                    className="p-4 text-white cursor-pointer hover:text-green-400 hover:underline transition-all"
                    onClick={() => onNavigate && onNavigate(user.teamId)}
                  >
                    {user.teamName}
                  </td>
                  <td className="p-4 text-emerald-400 font-mono text-sm">{user.teamCode}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-white/10 px-3 py-1 rounded transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}            
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}