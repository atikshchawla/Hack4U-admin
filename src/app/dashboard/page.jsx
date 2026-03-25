"use client";
import React, {useEffect, useState} from 'react';
import {formatLabel} from "../util/util";
import { useRouter } from "next/navigation";


const CircularProgress = ({ value, max, color = "text-green-500" }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="transform -rotate-90 w-full h-full">

        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-700"
        />

        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="absolute text-[10px] font-medium text-white">
        {value}/{max}
      </span>
    </div>
  );
};


// Change from destructuring to generic props
export default function HackathonDashboard(props) {
  const { onSelectTeam } = props;
  const [data, setData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", code: "", track: "" });
  const [menuOpenId, setMenuOpenId] = useState(null);
  const router = useRouter();

  const fetchDashboard = () => {
    fetch(`/api/dashboard`)
        .then(res => res.json())
        .then(fetchedData => setData(fetchedData))
        .catch(err => console.error(err));
  };

  useEffect(() => {
        fetchDashboard();
    }, []);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
    });
    setShowAddModal(false);
    fetchDashboard();
  };

  const handleDeleteTeam = async (id) => {
    if(!confirm("Are you sure?")) return;
    await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    fetchDashboard();
  };

    if (!data) return <p>Loading...</p>;
  console.log(data);
  const { teamlist: teams, teamcount, subcount } = data;

  return (
    // CHANGE 1: Removed 'font-sans' to ensure it inherits the exact same font stack as TeamDetails
    <div className="flex min-h-screen bg-black/50 text-white overflow-hidden relative">

    <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20 pointer-events-none"></div>

    <main className="flex-1 p-8 overflow-y-auto relative z-10">
      <header className="mb-10 flex justify-between items-center">
        <div>
            <h1 className="text-[20px] font-bold uppercase">Dashboard</h1>
            <p className="text-[#9A9A9A] text-sm mt-1">Hackathon overview and submission status</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition">
            + Add Team
        </button>
      </header>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <form onSubmit={handleAddTeam} className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 w-96 flex flex-col gap-4">
                <h2 className="text-xl text-white font-bold mb-2">Create New Team</h2>
                <input placeholder="Team Name" className="p-3 bg-white/5 text-white rounded-lg border border-white/10" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} required />
                <input placeholder="Team Code" className="p-3 bg-white/5 text-white rounded-lg border border-white/10" value={newTeam.code} onChange={e => setNewTeam({...newTeam, code: e.target.value})} required />
                <input placeholder="Track" className="p-3 bg-white/5 text-white rounded-lg border border-white/10" value={newTeam.track} onChange={e => setNewTeam({...newTeam, track: e.target.value})} />
                <div className="flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 px-4 py-2">Cancel</button>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">Create</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg p-6 flex flex-col justify-center h-32 relative">
           <h3 className="text-gray-300 text-sm mb-1 leading-tight uppercase">Number<br />of<br />Teams</h3>
           <span className="absolute right-8 top-1/2 -translate-y-1/2 text-5xl font-light text-white">{teamcount}</span>
        </div>

        <div className="bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg p-6 flex items-center justify-between h-32">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-white mb-1">Round 1</span>
            <span className="text-[#9A9A9A] text-sm">Submissions</span>
          </div>
          <CircularProgress value={subcount} max={teamcount} color="text-green-500" />
        </div>
      </div>

        <section>
          {/* CHANGE 3: Changed text-sm to text-[16px] and removed tracking-wider to match TeamDetails headers */}
          <h2 className="text-[16px] font-bold text-white uppercase mb-4 pl-2">Team Submission Status</h2>

          <div className="w-full">

            {/* CHANGE 4: Complete Overhaul of Table Headers
                - Removed: text-xs, text-gray-400, uppercase, tracking-wider
                - Added: text-white, border-b border-[#9A9A9A] (Exact match to TeamDetails table)
            */}
            <div className="grid grid-cols-12 gap-4 px-6 pb-2 mb-2 text-white font-bold border-b border-[#9A9A9A]">
              <div className="col-span-1"></div>
              <div className="col-span-2">Code</div>
              <div className="col-span-3">Team Name</div>
              <div className="col-span-4 text-center">Round 1 Submission</div>
              <div className="col-span-2"></div>
            </div>

            <div className="space-y-4">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg hover:bg-white/20 transition-colors"
                >
                  {/* CHANGE 5: Removed 'font-medium' from these lines. TeamDetails uses standard weight. */}
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-2 text-white">{team.code}</div>
                  <div className="col-span-3 text-white">{team.name}</div>

                  <div className={`col-span-4 text-center ${(team.submitted ? "text-green-400" : "text-amber-500" )} text-sm tracking-wide`}>
                    {formatLabel(team.submitted.toString())}
                  </div>

                  <div className="col-span-2 flex justify-end gap-2 relative">
                    <button
                      className="text-[14.4px] font-medium w-[117.6px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white hover:bg-[rgba(12,172,79,0.70)] transition-all cursor-pointer flex items-center justify-center"
                      onClick={() => { if(onSelectTeam) onSelectTeam(team.id); }}
                    >
                      View Details
                    </button>
                    
                    <button onClick={() => setMenuOpenId(menuOpenId === team.id ? null : team.id)} className="text-white hover:bg-white/10 rounded-full p-1 h-[24.8px] w-[24.8px] flex items-center justify-center">
                        ⋮
                    </button>
                    
                    {menuOpenId === team.id && (
                        <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-2 z-20 w-32">
                            <button onClick={() => handleDeleteTeam(team.id)} className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 text-sm">
                                Delete Team
                            </button>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}