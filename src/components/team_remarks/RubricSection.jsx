import {formatLabel} from "@/app/util/util";
import React from "react";

export default function RubricSection({ title, marksData, remarksData, handleChange, handleRemarksChange }) {

  const keys = Object.keys(marksData || {});

  const sectionTotal = keys.reduce((acc, key) => acc + (parseInt(marksData[key]) || 0), 0);

  return (
    <div>

      <h3 className="text-white text-[20px] font-bold mb-4 uppercase">{title}</h3>
      <div className="flex flex-col md:flex-row gap-8">

        <div className="flex-1">

          <div className="flex justify-between border-b border-[#9A9A9A] pb-2 text-[16px] text-white font-bold px-4">
            <span>Parameter Name</span>
            <span>Marks</span>
          </div>
          <div className="flex flex-col mt-2">
            {keys.map((key) => (
              <div key={key} className="flex justify-between items-center text-white border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors px-4 py-4 cursor-pointer group rounded-lg">
                <label htmlFor={key} className="cursor-pointer flex-1 text-[14.4px]">
                  {formatLabel(key)}
                </label>
                <input
                  type="number"
                  min="0" max="10" step="1"
                  id={key}
                  name={key}
                  value={marksData[key]}
                  onChange={handleChange}
                  className="bg-transparent text-white w-16 text-right font-mono focus:outline-none focus:border-b focus:border-green-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-4 sticky top-0 h-fit">
          <div className="bg-[rgba(255,255,255,0.05)] border border-white/20 rounded-[10px] p-1 h-32 relative group focus-within:ring-1 hover:ring-1 focus-within:ring-green-500/50 hover:ring-green-500/50 transition-all shadow-inner">
            <textarea
              id="remarks"
              name="remarks"
              value={remarksData}
              onChange={handleRemarksChange}
              placeholder="Add Remarks"
              className="w-full h-full bg-transparent text-white p-3 text-sm focus:outline-none resize-none placeholder-[#9A9A9A]"
            />
          </div>
          <div className="flex items-center justify-between mt-auto px-1">
            <span className="text-white font-bold tracking-wide text-[14px]">TOTAL MARKS</span>
            <div className="bg-[rgba(12,172,79,0.20)] border border-green-500/30 text-white px-6 py-1.5 rounded-full font-bold min-w-[3rem] text-center">
              {sectionTotal}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};