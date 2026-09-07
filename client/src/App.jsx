import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import AnalyzerCard from "./components/AnalyzerCard.jsx";
import AnalysisResults from "./components/AnalysisResults.jsx";
import { analyzeRepository } from "./services/analyzerService.js";

const App = () => {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (repoUrl, mode) => {
    setIsLoading(true);
    setShowResults(false);
    setError("");

    try {
      const data = await analyzeRepository(repoUrl, mode);

      console.log("Backend response:", data);

      setAnalysis(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error: ", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <Hero />
      <AnalyzerCard onAnalyze={handleAnalyze} isLoading={isLoading} />
      {error && (
        <div className="max-w-5xl mx-auto px-7 mt-6">
          <div className="border border-red-300 bg-red-50 text-red-700 rounded-xl px-5 py-4">
            <p className="font-semibold">Analysis failed</p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Analyzing repository...</p>
        </div>
      )}

      {showResults && !isLoading && <AnalysisResults analysis={analysis} />}
    </div>
  );
};

export default App;
