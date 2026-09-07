const express = require("express");
const {
  getRepository,
  getLanguages,
  calculateLanguagePercentages,
  getReadme,
  getCommits,
  getContributors,
  prepareCommitData,
  prepareContributorData,
  getRepositoryTree,
} = require("../services/githubService");
const {
  parseGitHubUrl,
  prepareRepositoryData,
  prepareAnalysisData,
  prepareRepositoryTree,
  getRepositoryStructure,
} = require("../utils/githubUtils");
const { analyzeRepository } = require("../services/llmService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { repoUrl, mode } = req.body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return res.status(400).json({
        error: "GitHub repository URL is required.",
      });
    }

    if (!["professional", "roast"].includes(mode)) {
      return res.status(400).json({
        error: "Invalid analysis mode.",
      });
    }

    const { owner, repo } = parseGitHubUrl(repoUrl);

    console.log("Owner:", owner);
    console.log("Repository:", repo);
    console.log("Mode:", mode);

    const repository = await getRepository(owner, repo);
    const tree = await getRepositoryTree(
      owner,
      repo,
      repository.default_branch,
    );
    const repositoryTree = prepareRepositoryTree(tree);
    const repositoryStructure = getRepositoryStructure(repositoryTree);
    const repositoryData = prepareRepositoryData(repository);
    const languages = await getLanguages(owner, repo);
    const languagePercentages = await calculateLanguagePercentages(languages);
    const readme = await getReadme(owner, repo);
    const commits = await getCommits(owner, repo);
    const contributors = await getContributors(owner, repo);
    const commitData = await prepareCommitData(commits);
    const contributorData = await prepareContributorData(contributors);

    const analysisData = prepareAnalysisData({
      repository: repositoryData,
      languages: languagePercentages,
      readme,
      commits: commitData,
      contributors: contributorData,
      repositoryTree,
      repositoryStructure,
    });
    const aiAnalysis = await analyzeRepository(analysisData, mode);

    res.json({
      mode,
      analysisData,
      analysis: aiAnalysis,
    });
  } catch (error) {
    console.error("ANALYZE ERROR:", error);

    const message = error.message || "Something went wrong";

    if (message.includes("Invalid GitHub repository URL")) {
      return res.status(400).json({
        error: "Please enter a valid GitHub repository URL.",
      });
    }

    if (
      message.includes("Not Found") ||
      message.includes("Failed to fetch repository")
    ) {
      return res.status(404).json({
        error: "GitHub repository not found.",
      });
    }

    if (message.includes("rate limit") || message.includes("API rate limit")) {
      return res.status(429).json({
        error: "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    if (
      message.includes("Ollama") ||
      message.includes("ollama") ||
      message.includes("invalid JSON")
    ) {
      return res.status(502).json({
        error: "AI analysis service is currently unavailable.",
      });
    }

    return res.status(500).json({
      error: "Something went wrong while analyzing the repository.",
    });
  }
});

module.exports = router;
