const githubHeaders = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};
const getRepository = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: githubHeaders,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

const getLanguages = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: githubHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository languages");
  }

  return response.json();
};

const calculateLanguagePercentages = (languages) => {
  let total = 0;
  const percentages = {};
  Object.entries(languages).forEach(([language, value]) => {
    total += value;
  });
  Object.entries(languages).forEach(([language, value]) => {
    const percentage = (value / total) * 100;
    percentages[language] = Number(percentage.toFixed(2));
  });
  return percentages;
};

const getReadme = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
      },
      githubHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch README");
  }

  return response.text();
};

const getCommits = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
    {
      headers: githubHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch commits");
  }

  return response.json();
};

const getContributors = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`,
    {
      headers: githubHeaders,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contributors");
  }

  return response.json();
};

const prepareCommitData = (commits) => {
  return commits.map((commit) => ({
    message: commit.commit.message,
    author: commit.commit.author?.name,
    date: commit.commit.author?.date,
  }));
};

const prepareContributorData = (contributors) => {
  return contributors.map((contributor) => ({
    username: contributor.login,
    contributions: contributor.contributions,
  }));
};

const getRepositoryTree = async (owner, repo, branch) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: githubHeaders,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository tree");
  }

  const data = await response.json();

  return data.tree;
};

module.exports = {
  getRepository,
  getLanguages,
  calculateLanguagePercentages,
  getReadme,
  getCommits,
  getContributors,
  prepareCommitData,
  prepareContributorData,
  getRepositoryTree,
};
