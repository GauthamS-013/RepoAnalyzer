const parseGitHubUrl = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname !== "github.com") {
      throw new Error("Invalid GitHub URL");
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL");
    }

    return {
      owner: parts[0],
      repo: parts[1],
    };
  } catch (error) {
    throw new Error("Invalid GitHub repository URL");
  }
};

const prepareRepositoryData = (repository) => {
  return {
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description,
    url: repository.html_url,

    stars: repository.stargazers_count,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,

    language: repository.language,

    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at,

    topics: repository.topics,
    defaultBranch: repository.default_branch,

    license: repository.license?.name,

    archived: repository.archived,
  };
};

const prepareAnalysisData = ({
  repository,
  languages,
  readme,
  commits,
  contributors,
  repositoryStructure,
}) => {
  const activity = getActivityMetrics(repository, commits);

  const documentation = getDocumentationMetrics(readme, repository);
  return {
    repository,
    languages,

    repositoryStructure,

    documentation: {
      ...documentation,
    readme: readme
      ? readme.slice(0, 10000)
      : null,
    },

    activity,

    community: {
      contributorCount: contributors.length,
      contributors,
    },
  };
};

const prepareRepositoryTree = (tree) => {
  const ignoredPaths = [
    "node_modules/",
    ".git/",
    "dist/",
    "build/",
    "coverage/",
    ".next/",
  ];

  const filteredTree = tree.filter((item) => {
    return !ignoredPaths.some((ignoredPath) =>
      item.path.startsWith(ignoredPath),
    );
  });

  const files = filteredTree
    .filter((item) => item.type === "blob")
    .map((item) => item.path);

  const directories = filteredTree
    .filter((item) => item.type === "tree")
    .map((item) => item.path);

  return {
    fileCount: files.length,
    directoryCount: directories.length,
    files,
    directories,
  };
};

const getRepositoryStructure = (repositoryTree) => {
  const files = repositoryTree.files;
  const directories = repositoryTree.directories;

  const hasDirectory = (name) =>
    directories.some(
      (directory) => directory === name || directory.startsWith(`${name}/`),
    );

  const hasFile = (name) =>
    files.some((file) => file === name || file.endsWith(`/${name}`));

  const hasTests = files.some((file) =>
    /(^|\/)(test|tests|__tests__)(\/|$)/i.test(file),
  );

  return {
    fileCount: repositoryTree.fileCount,
    directoryCount: repositoryTree.directoryCount,

    hasSrcDirectory: hasDirectory("src"),
    hasServerDirectory: hasDirectory("server"),
    hasComponentsDirectory: hasDirectory("components"),
    hasServicesDirectory: hasDirectory("services"),
    hasUtilsDirectory: hasDirectory("utils"),

    hasTests,

    hasPackageJson: hasFile("package.json"),
    hasGitignore: hasFile(".gitignore"),
    hasDockerfile: hasFile("Dockerfile"),

    hasViteConfig: files.some((file) =>
      /vite\.config\.(js|ts|mjs|cjs)$/i.test(file),
    ),

    hasNextConfig: files.some((file) =>
      /next\.config\.(js|ts|mjs|cjs)$/i.test(file),
    ),
  };
};

const getActivityMetrics = (repository, commits) => {
  const now = new Date();

  const createdAt = new Date(repository.createdAt);
  const pushedAt = repository.pushedAt ? new Date(repository.pushedAt) : null;

  const repositoryAgeDays = Math.floor(
    (now - createdAt) / (1000 * 60 * 60 * 24),
  );

  const daysSinceLastPush = pushedAt
    ? Math.floor((now - pushedAt) / (1000 * 60 * 60 * 24))
    : null;

  return {
    repositoryAgeDays,
    daysSinceLastPush,
    latestCommit: commits[0] || null,
    latestCommitDate: commits[0]?.date || null,
    commitsFetched: commits.length,
  };
};

const getDocumentationMetrics = (readme, repository) => {
  const content = readme || "";
  const lowerContent = content.toLowerCase();

  return {
    hasReadme: Boolean(readme),
    readmeLength: content.length,

    hasInstallation: /installation|install|setup|getting started/i.test(
      content,
    ),

    hasUsage: /usage|how to use|examples|example/i.test(content),

    hasFeatures: /features|functionality/i.test(content),

    hasTechStack: /tech stack|technologies|built with|technology/i.test(
      content,
    ),

    hasContributing: /contributing|contribution/i.test(content),

    hasLicense: Boolean(repository.license),
  };
};

module.exports = {
  parseGitHubUrl,
  prepareRepositoryData,
  prepareAnalysisData,
  prepareRepositoryTree,
  getRepositoryStructure,
  getActivityMetrics,
  getDocumentationMetrics,
};
