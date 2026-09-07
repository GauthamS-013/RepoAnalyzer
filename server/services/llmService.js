// const { GoogleGenAI } = require("@google/genai");
const { Ollama } = require("ollama");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });
const ai = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
});

const MODEL = "gpt-oss:120b-cloud";

const analyzeRepository = async (analysisData, mode) => {
  const prompt = `
You are an expert software engineering reviewer analyzing a GitHub repository.

IMPORTANT:
This is a repository-level analysis based ONLY on the metadata and signals provided below.

You are NOT performing a line-by-line source code review.

Do not claim that code is clean, secure, optimized, well-written, or poorly written unless the provided evidence supports that conclusion.

Analysis mode: ${mode}

==================================================
REPOSITORY DATA
==================================================

${JSON.stringify(analysisData, null, 2)}

==================================================
SCORING RULES
==================================================

Give four component scores from 0 to 100.

1. CODE QUALITY
Because source code itself is not being analyzed:
- Be conservative.
- Use repository organization, technology consistency, and available metadata as indirect signals.
- Do NOT pretend you inspected individual functions or algorithms.

2. STRUCTURE
Consider:
- file organization
- directory organization
- presence of src/
- components/
- services/
- utils/
- tests
- package configuration
- deployment configuration

Do not penalize a repository simply because it uses a different valid architecture.

3. DOCUMENTATION
Consider:
- README existence
- README length
- installation instructions
- usage instructions
- features
- technology stack
- contributing information
- license

4. ACTIVITY
Consider:
- repository age
- days since last push
- latest commit information

Do not assume that a repository is inactive simply because only a limited number of commits were provided.

==================================================
OVERALL SCORE
==================================================

Calculate overallScore using:

overallScore =
(codeQuality × 0.30) +
(structure × 0.25) +
(documentation × 0.20) +
(activity × 0.25)

Round the result to the nearest integer.

Do NOT choose an overall score independently.

==================================================
PROFESSIONAL MODE
==================================================

If mode is "professional":

- Be objective.
- Be constructive.
- Clearly explain genuine weaknesses.
- Avoid unnecessary criticism.
- Recommendations should be practical.

==================================================
ROAST MODE
==================================================

If mode is "roast":

- Keep ALL factual conclusions identical to professional mode.
- Only change the presentation and tone.
- Be sarcastic and humorous.
- Make jokes about actual weaknesses.
- Do not invent problems.
- Do not make recommendations useless.
- Do not insult the developer personally.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "scores": {
    "codeQuality": 0,
    "structure": 0,
    "documentation": 0,
    "activity": 0
  },
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "recommendations": []
}

Rules:
- All scores must be integers between 0 and 100.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- recommendations must be an array of strings.
- Do not include markdown.
- Do not include code fences.
- Do not include any text outside the JSON object.
`;

  const response = await ai.chat({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: false,
  });

  const text = response.message.content.trim();

  try {
    const parsed = JSON.parse(text);

    return validateAnalysis(parsed);
  } catch (error) {
    console.error("Failed to parse Ollama response:", text);

    throw new Error("Ollama returned invalid JSON");
  }
};

const validateAnalysis = (analysis) => {
  if (!analysis || typeof analysis !== "object") {
    throw new Error("Invalid analysis response");
  }

  const scores = analysis.scores;

  if (!scores) {
    throw new Error("Missing analysis scores");
  }

  const scoreFields = [
    "overallScore",
    "codeQuality",
    "structure",
    "documentation",
    "activity",
  ];

  for (const field of scoreFields) {
    const value = field === "overallScore" ? analysis[field] : scores[field];

    if (typeof value !== "number" || value < 0 || value > 100) {
      throw new Error(`Invalid score: ${field}`);
    }
  }

  if (typeof analysis.summary !== "string") {
    throw new Error("Invalid summary");
  }

  if (!Array.isArray(analysis.strengths)) {
    throw new Error("Invalid strengths");
  }

  if (!Array.isArray(analysis.weaknesses)) {
    throw new Error("Invalid weaknesses");
  }

  if (!Array.isArray(analysis.recommendations)) {
    throw new Error("Invalid recommendations");
  }

  return analysis;
};

module.exports = {
  analyzeRepository,
};
