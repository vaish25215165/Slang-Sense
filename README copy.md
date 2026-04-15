# SlangSense — AI-Powered Slang Decoder

A Next.js web app that decodes Gen-Z, Gen-Alpha, and Millennial slang using:
1. **Urban Dictionary CSV dataset** (`data/urbandict-word-defs.csv`) — 100+ entries, checked first
2. **Claude AI** (claude-sonnet-4) — fallback for any slang not in the dataset

---

## Setup & Run

### 1. Install dependencies
```bash
pnpm install
# or: npm install
```

### 2. Add your Anthropic API key

Create a `.env.local` file in the project root:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at https://console.anthropic.com

### 3. Run the dev server
```bash
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production
```bash
pnpm build && pnpm start
```

---

## Architecture

```
/data/urbandict-word-defs.csv   ← Urban Dictionary dataset (100+ slang entries)
/app/api/analyze/route.ts       ← API route: reads CSV + calls Claude AI
/lib/slang-data.ts              ← Shared types + client-side data
/components/slang-analyzer.tsx  ← Main search UI (calls /api/analyze)
/components/slang-result-card.tsx ← Result cards (shows DB vs AI source)
/app/library/page.tsx           ← Browse full slang library
```

## How it works

1. User types text → hits "Analyze Slang"
2. Frontend POSTs to `/api/analyze`
3. Server reads `urbandict-word-defs.csv` and matches words/phrases
4. Any unrecognized slang is sent to Claude AI for analysis
5. Results stream back — cards show `DB` or `AI` badge for source

## Extending the Dataset

To add more slang, edit `data/urbandict-word-defs.csv`:
```
word,meaning,tone,example,generation
newword,What it means,positive,Example sentence here.,Gen-Z
```

Valid `tone` values: `positive`, `neutral`, `negative`, `sarcastic`  
Valid `generation` values: `Gen-Z`, `Gen-Alpha`, `Millennial`
