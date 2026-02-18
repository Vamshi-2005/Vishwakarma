# AI Setup (Ollama Integration)

## Setup
1. Install Ollama: https://ollama.com  
2. Pull model:
   ollama pull granite3.3:2b
3. Start service:
   ollama serve

## Usage in Backend (TypeScript)
Import:

import { generateConstructionPlan } from "../ai/ollamaClient";

Call:

const aiText = await generateConstructionPlan(area, floors, timeline);

## Notes
- Ollama must be running locally during demo
- No API keys required
