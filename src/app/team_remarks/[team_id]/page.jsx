'use client';

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import RubricSection from "@/components/team_remarks/RubricSection";
import BackArrowIcon from "@/components/team_remarks/BackArrowIcon";

export default function TeamRemarks() {

  const { data: session } = useSession();
  const email = session?.user?.email;

  const [data, setData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ROUND_1_DEFAULTS = {
    problemClarity: 0,
    UIUX: 0,
    feasibility: 0,
    TechStack: 0,
    pitch: 0,
  };

  const ROUND_2_DEFAULTS = {
    designUX: 0,
    technicalExecution: 0,
    web3Integration: 0,
    impact: 0,
    completeness: 0,
    futureScope: 0,
  };

  const ROUND_3_DEFAULTS = {
    finalPitch: 0,
    marketViability: 0,
    innovationFactor: 0,
    completeProduct: 0,
    qnaHandling: 0
  };

  const { team_id } = useParams();

  const handleRoundSwitch = () => {
    if (!data) return;
    
    setData(prev => {
      const current = prev.roundNum;
      let nextRoundNum, nextDefaults;

      if (current === 1) {
        nextRoundNum = 2;
        nextDefaults = ROUND_2_DEFAULTS;
      } else if (current === 2) {
        nextRoundNum = 3;
        nextDefaults = ROUND_3_DEFAULTS;
      } else {
        nextRoundNum = 1;
        nextDefaults = ROUND_1_DEFAULTS;
      }

      return {
        ...prev,
        roundNum: nextRoundNum,
        roundDetails: nextDefaults 
      };
    });
  };

  const handlePromote = async () => {
    const nextRound = (data.teamRound || 1) + 1;
    if (!confirm(`Promote team to Round ${nextRound}?`)) return;
    
    try {
      const res = await fetch(`/api/teams/${team_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round: nextRound })
      });

      if (res.ok) {
        alert(`Team promoted to Round ${nextRound}!`);
        setData(prev => ({ ...prev, teamRound: nextRound }));
      } else {
        alert("Failed to promote team.");
      }
    } catch (err) {
      console.error(err);
      alert("Error promoting team.");
    }
  };
  async function handleSubmit(event) {
      event.preventDefault();
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 300);

    const response = await fetch(`/api/team_remarks/${team_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const res = await response.json();
    console.log(res);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let num = Math.round(Number(value));
    if (num < 0) num = 0;
    else if (num > 10) num = 10;

    if (name === "remarks") setData((prev) => ({
      ...prev, roundDetails: { ...prev.roundDetails },
      [name]: value
    }))

    else setData((prev) => ({
      ...prev, roundDetails: {
        ...prev.roundDetails,
        [name]: value === "" ? 0 : num
      }
    }));
  };

  useEffect(() => {
    if(!team_id) return;
    fetch(`/api/team_remarks/${team_id}?email=${email}`)
      .then(res => res.json())
      .then(fetchedData => {
        console.log(fetchedData);
        setData({ ...fetchedData, "email": email });
      })
      .catch(err => console.error(err));
  }, [team_id, email]);

  if (!data) return <p className="text-white p-8">Loading...</p>;

  const { roundDetails: marks, remarks, teamName, track } = data;

  return (

    <div className="flex min-h-screen bg-black/50 overflow-hidden relative">


      <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20 pointer-events-none z-0"></div>



      <main className="flex-1 p-8 overflow-y-auto h-screen relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#9A9A9A] mb-6 cursor-pointer hover:text-white w-fit transition-colors">
            <BackArrowIcon />

            <span className="uppercase text-[14px] font-medium">Team Remarks</span>
          </div>

          <div className="flex gap-4">
              {data.teamRound < 3 && (
                <button 
                  type="button" 
                  onClick={handlePromote}
                  className="bg-emerald-600 border border-emerald-500 text-white px-6 py-2 rounded-[20px] text-[14px] font-bold shadow-[0_4px_14px_0_rgba(12,172,79,0.39)] hover:bg-emerald-500 transition-colors"
                >
                  Approve for Round {data.teamRound + 1}
                </button>
              )}
              {data.teamRound >= 3 && (
                 <span className="bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 px-6 py-2 rounded-[20px] text-[14px] font-medium flex items-center">
                    ✅ Finalist (Round 3)
                 </span>
              )}

              <button 
                type="button" 
                onClick={handleRoundSwitch}
                className="bg-[rgba(255,255,255,0.10)] border border-white/30 text-white px-6 py-2 rounded-[20px] text-[14px] font-medium backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer"
              >
                Round {data.roundNum}
              </button>
            </div>
        </div>


        <form onSubmit={handleSubmit} className="bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-[10px] p-8 relative mb-10">

          <RubricSection
            title="RUBRICS"
            marksData={marks}
            remarksData={remarks}
            handleChange={handleChange}
            handleRemarksChange={handleChange}
          />

          <div className="flex justify-end border-t border-[#9A9A9A] pt-6 mt-6">

            <input
              type="submit"
              value={(isSubmitted ? "Submitted!" : "Submit")}
              className="text-[14.4px] font-medium w-[140px] h-[35px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white hover:bg-[rgba(12,172,79,0.70)] transition-all cursor-pointer"
            />
          </div>

        </form>
      </main>
    </div>
  );
}