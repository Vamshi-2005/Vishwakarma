import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "granite3.3:2b";

export async function generateConstructionPlan(
  area: number,
  floors: number,
  timeline: number
): Promise<string> {
  const prompt = `
You are an AI construction planning assistant for Indian residential projects.

Generate:
1) Floor-wise blueprint layout (text)
2) Week-by-week construction schedule
3) Workforce & cost overview

Inputs:
Area: ${area} sq ft
Floors: ${floors}
Timeline: ${timeline} days
`;

  const res = await axios.post(
    OLLAMA_URL,
    {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
    },
    { timeout: 120000 }
  );

  return res.data.response;
}
