import React from "react";
import { useState } from "react";

const AnalyzerCard = ({ onAnalyze, isLoading }) => {
  const [mode, setMode] = useState("professional");
  const isRoast = mode === "roast";
  const [repoUrl,setRepoUrl] = useState("")

  return (
    <section className="flex justify-center items-center px-7 mt-12">
      <div
        className={`w-full max-w-5xl rounded-2xl border p-6 md:p-12 shadow-md transition-all duration-300 ${
          isRoast
            ? "border-orange-600 bg-linear-to-br from-neutral-950 via-red-950 to-orange-950 text-orange-50"
            : "border-emerald-800 bg-emerald-50 text-emerald-950"
        }`}
      >
        <div className="flex flex-col items-center">
          <h4
            className={`font-semibold mb-3 ${
              isRoast ? "text-orange-100" : "text-emerald-900"
            }`}
          >
            Choose your analysis style
          </h4>

          <button
            onClick={() => setMode(isRoast ? "professional" : "roast")}
            className={`relative w-52 h-12 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isRoast ? "bg-stone-800" : "bg-emerald-800"
            }`}
          >
            <span
              className={`absolute top-1 w-10 h-10 rounded-full shadow-md transition-all duration-300 ${
                isRoast
                  ? "left-[calc(100%-44px)] bg-orange-500"
                  : "left-1 bg-white"
              }`}
            />
            <span
              className={`absolute inset-0 flex items-center font-bold text-sm transition-all duration-300 ${
                isRoast
                  ? "justify-center pr-8 text-orange-200"
                  : "justify-center pl-8 text-white"
              }`}
            >
              {isRoast ? "Roast" : "Professional"}
            </span>
          </button>

          <div className="mt-18 flex flex-col gap-7 justify-center items-center w-full max-w-xl">
            <input
              type="text"
              placeholder="https://github.com/user/repository"
              value={repoUrl}
              onChange={(e)=>setRepoUrl(e.target.value)}
              className={`rounded-full px-3 py-3 transition w-full outline-none border ${
                isRoast
                  ? "border-orange-600 bg-stone-900/60 text-orange-50 placeholder:text-orange-200/50 hover:bg-stone-900/80 focus:ring-2 focus:ring-orange-500"
                  : "border-emerald-800 text-gray-800 hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-700"
              }`}
            />
            <button
              onClick={()=>onAnalyze(repoUrl,mode)}
              disabled={isLoading}
              className={`flex-1 items-center justify-center rounded-xl md:px-6 px-3 py-3 font-bold transition cursor-pointer md:w-1/4 w-1/2 ${
                isRoast
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-emerald-800 text-white hover:bg-emerald-900"
              }`}
            >
              {isLoading ? "Analyzing..." : isRoast ? "Roast it" : "Analyze"}
              {!isLoading && (
                <i className="fa-solid fa-arrow-right text-white ps-3"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyzerCard;
