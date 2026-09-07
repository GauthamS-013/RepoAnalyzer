import React from "react";

const AnalysisResults = ({ analysis }) => {
  const { analysisData, analysis: aiAnalysis } = analysis;

  const {
    repository,
    languages,
    repositoryStructure,
    documentation,
    activity,
    community,
  } = analysisData;

  // -------------------------
  // Reusable components
  // -------------------------

  const ScoreCard = ({ title, score }) => {
    return (
      <div className="rounded-xl border p-5 shadow-md">
        <p className="text-sm font-semibold text-gray-600">
          {title}
        </p>

        <h3 className="text-3xl font-bold mt-2 text-emerald-800">
          {score}
        </h3>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="h-2 rounded-full bg-emerald-700"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  const Stat = ({ label, value }) => {
    return (
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    );
  };

  const Signal = ({ label, value }) => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-700">{label}</span>
        <span
          className={`font-semibold ${
            value ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      </div>
    );
  };

  const Recommendation = ({ number, text }) => {
    return (
      <div className="flex gap-4 items-start">
        <span className="text-sm font-bold mt-1 text-emerald-800">
          {String(number).padStart(2, "0")}
        </span>
        <p className="text-gray-800">{text}</p>
      </div>
    );
  };

  return (
    <section className="mx-7 my-8">
      <div className="mx-auto max-w-5xl">
        {/* -------------------------------- */}
        {/* Repository Header                */}
        {/* -------------------------------- */}

        <div className="mt-16">
          <p className="text-sm font-semibold text-gray-500 tracking-wider">
            REPOSITORY ANALYSIS
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800">
                {repository.name}
              </h2>

              {repository.description && (
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {repository.description}
                </p>
              )}
            </div>

            <a
              href={repository.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold hover:underline text-emerald-800"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Repository Stats                 */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
          <div className="border rounded-xl p-5 shadow-md">
            <Stat label="Stars" value={`⭐ ${repository.stars}`} />
          </div>

          <div className="border rounded-xl p-5 shadow-md">
            <Stat label="Forks" value={`🍴 ${repository.forks}`} />
          </div>

          <div className="border rounded-xl p-5 shadow-md">
            <Stat label="Open Issues" value={`🐛 ${repository.openIssues}`} />
          </div>

          <div className="border rounded-xl p-5 shadow-md">
            <Stat label="Contributors" value={community.contributorCount} />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Overall Score                    */}
        {/* -------------------------------- */}

        <div className="mt-6 rounded-xl border shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-2xl font-semibold text-emerald-800">Overall Score</p>

            <p className="max-w-2xl text-gray-700 mt-4">{aiAnalysis.summary}</p>
          </div>

          <div className="flex items-center justify-center w-36 h-36 rounded-full border-8 border-emerald-700">
            <span className="text-4xl font-bold text-emerald-800">
              {aiAnalysis.overallScore}
            </span>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Score Breakdown                  */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <ScoreCard
            title="Code Quality"
            score={aiAnalysis.scores.codeQuality}
          />
          <ScoreCard title="Structure" score={aiAnalysis.scores.structure} />
          <ScoreCard
            title="Documentation"
            score={aiAnalysis.scores.documentation}
          />
          <ScoreCard title="Activity" score={aiAnalysis.scores.activity} />
        </div>

        {/* -------------------------------- */}
        {/* Strengths / Weaknesses           */}
        {/* -------------------------------- */}

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-emerald-800">
              Strengths
            </h3>

            <ul className="mt-5 space-y-3 text-gray-800">
              {aiAnalysis.strengths.map((strength, index) => (
                <li key={index}>
                  <span className="text-emerald-600 font-bold">✓</span>{" "}
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-red-700">Weaknesses</h3>

            <ul className="mt-5 space-y-3 text-gray-800">
              {aiAnalysis.weaknesses.map((weakness, index) => (
                <li key={index}>
                  <span className="text-red-600 font-bold">!</span> {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Repository Structure             */}
        {/* -------------------------------- */}

        <div className="border rounded-xl p-6 mt-6 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-emerald-800">
              Repository Structure
            </h3>

            <span className="text-sm text-gray-500">
              {repositoryStructure.fileCount} files ·{" "}
              {repositoryStructure.directoryCount} directories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mt-6">
            <Signal
              label="src/ directory"
              value={repositoryStructure.hasSrcDirectory}
            />
            <Signal
              label="Components"
              value={repositoryStructure.hasComponentsDirectory}
            />
            <Signal
              label="Services"
              value={repositoryStructure.hasServicesDirectory}
            />
            <Signal
              label="Utils"
              value={repositoryStructure.hasUtilsDirectory}
            />
            <Signal label="Tests" value={repositoryStructure.hasTests} />
            <Signal
              label="package.json"
              value={repositoryStructure.hasPackageJson}
            />
            <Signal
              label=".gitignore"
              value={repositoryStructure.hasGitignore}
            />
            <Signal
              label="Dockerfile"
              value={repositoryStructure.hasDockerfile}
            />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Documentation                    */}
        {/* -------------------------------- */}

        <div className="border rounded-xl p-6 mt-6 shadow-md">
          <h3 className="text-2xl font-semibold text-emerald-800">
            Documentation
          </h3>

          <p className="text-gray-500 mt-1">
            README contains approximately {documentation.readmeLength}{" "}
            characters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mt-6">
            <Signal label="README" value={documentation.hasReadme} />
            <Signal
              label="Installation instructions"
              value={documentation.hasInstallation}
            />
            <Signal label="Usage instructions" value={documentation.hasUsage} />
            <Signal label="Features" value={documentation.hasFeatures} />
            <Signal
              label="Technology stack"
              value={documentation.hasTechStack}
            />
            <Signal
              label="Contributing guide"
              value={documentation.hasContributing}
            />
            <Signal label="License" value={documentation.hasLicense} />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Activity                         */}
        {/* -------------------------------- */}

        <div className="border rounded-xl p-6 mt-6 shadow-md">
          <h3 className="text-2xl font-semibold text-emerald-800">
            Activity
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <Stat
              label="Repository Age"
              value={`${activity.repositoryAgeDays} days`}
            />
            <Stat
              label="Last Push"
              value={`${activity.daysSinceLastPush} days ago`}
            />
            <Stat label="Commits Inspected" value={activity.commitsFetched} />
            <Stat label="Contributors" value={community.contributorCount} />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Languages                        */}
        {/* -------------------------------- */}

        <div className="border rounded-xl p-6 mt-6 shadow-md">
          <h3 className="text-2xl font-semibold text-emerald-800">
            Languages
          </h3>

          <div className="mt-6 space-y-4">
            {Object.entries(languages).map(([language, percentage]) => (
              <div key={language}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-800 font-medium">{language}</span>
                  <span className="text-gray-600">{percentage}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Recommendations                  */}
        {/* -------------------------------- */}

        <div className="border rounded-xl p-6 mt-6 shadow-md">
          <h3 className="text-2xl font-semibold text-emerald-800">
            Recommendations
          </h3>

          <div className="mt-6 flex flex-col gap-4">
            {aiAnalysis.recommendations.map((recommendation, index) => (
              <Recommendation
                key={index}
                number={index + 1}
                text={recommendation}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisResults;